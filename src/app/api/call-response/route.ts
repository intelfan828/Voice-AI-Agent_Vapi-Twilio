import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const speechResult = formData.get('SpeechResult') as string;
    const callSid = formData.get('CallSid') as string;

    // Update the callback record with the speech result
    const callbackRef = doc(db, 'callbacks', callSid);
    await updateDoc(callbackRef, {
      speechResult,
      status: 'completed',
      updatedAt: new Date().toISOString(),
    });

    // Respond with TwiML to end the call
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Thank you for providing your information. You will receive an email with a secure link to access your consultation portal.</Say>
        <Hangup/>
      </Response>`;

    return new NextResponse(twiml, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Error processing call response:', error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>We apologize, but there was an error processing your response. Please try again later.</Say>
        <Hangup/>
      </Response>`,
      {
        headers: {
          'Content-Type': 'text/xml',
        },
      }
    );
  }
} 