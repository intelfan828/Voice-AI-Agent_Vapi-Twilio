import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import twilio from 'twilio';

const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER as string;
if (!twilioPhoneNumber) {
  throw new Error('TWILIO_PHONE_NUMBER environment variable is required');
}

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: Request) {
  try {
    const { phone, email } = await request.json();

    // Store the callback request in Firestore
    const callbackRef = await addDoc(collection(db, 'callbacks'), {
      phone,
      email,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    // Create Vapi assistant for the conversation
    const assistantResponse = await fetch('https://api.vapi.ai/assistant', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Callback Assistant',
        model: 'gpt-4',
        systemPrompt: `You are a professional callback assistant. Your task is to:
          1. Greet the user professionally
          2. Collect information about their consultation needs:
             - Type of consultation
             - Category
             - Country
             - Language preference
             - Urgency level
             - Address (if necessary)
             - Summary of their request
          3. Be conversational and natural in your interaction
          4. Once all information is collected, inform them that they will receive an email with a secure link
          5. Thank them for their time`,
        voice: 'alloy',
      }),
    });

    if (!assistantResponse.ok) {
      throw new Error('Failed to create Vapi assistant');
    }

    const assistant = await assistantResponse.json();

    // Initialize the call using Twilio with Vapi integration
    const call = await twilioClient.calls.create({
      to: phone,
      from: twilioPhoneNumber,
      twiml: `<Response>
        <Connect>
          <Stream url="wss://api.vapi.ai/stream/${assistant.id}">
            <Parameter name="phone" value="${phone}"/>
            <Parameter name="email" value="${email}"/>
            <Parameter name="callbackId" value="${callbackRef.id}"/>
          </Stream>
        </Connect>
      </Response>`,
      statusCallback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/call-status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
    });

    return NextResponse.json({
      requestId: callbackRef.id,
      callId: call.sid,
      assistantId: assistant.id,
    });
  } catch (error) {
    console.error('Error processing callback request:', error);
    return NextResponse.json(
      { error: 'Failed to process callback request' },
      { status: 500 }
    );
  }
} 