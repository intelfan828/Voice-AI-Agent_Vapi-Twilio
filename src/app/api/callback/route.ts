import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import twilio from 'twilio';

export async function POST(request: Request) {
  try {
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER as string;
    const vapiApiKey = process.env.VAPI_API_KEY as string;
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID as string;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN as string;

    // Validate all required environment variables
    if (!twilioPhoneNumber) {
      return NextResponse.json(
        { error: 'TWILIO_PHONE_NUMBER environment variable is required' },
        { status: 500 }
      );
    }

    if (!vapiApiKey) {
      return NextResponse.json(
        { error: 'VAPI_API_KEY environment variable is required' },
        { status: 500 }
      );
    }

    if (!twilioAccountSid || !twilioAuthToken) {
      return NextResponse.json(
        { error: 'TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables are required' },
        { status: 500 }
      );
    }

    const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

    const { phone, email } = await request.json();

    if (!phone || !email) {
      return NextResponse.json(
        { error: 'Phone and email are required' },
        { status: 400 }
      );
    }

    // Store the callback request in Firestore
    const callbackRef = await addDoc(collection(db, 'callbacks'), {
      phone,
      email,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    // Use existing Vapi assistant
    const vapiAssistantId = process.env.VAPI_ASSISTANT_ID;
    if (!vapiAssistantId) {
      return NextResponse.json(
        { error: 'VAPI_ASSISTANT_ID environment variable is required' },
        { status: 500 }
      );
    }

    // Initialize the call using Twilio with Vapi integration
    const call = await twilioClient.calls.create({
      to: phone,
      from: twilioPhoneNumber,
      twiml: `<Response>
        <Connect>
          <Stream url="wss://api.vapi.ai/streams/${vapiAssistantId}?environment=production&mode=production">
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
      assistantId: vapiAssistantId,
    });
  } catch (error) {
    console.error('Error processing callback request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process callback request' },
      { status: 500 }
    );
  }
} 