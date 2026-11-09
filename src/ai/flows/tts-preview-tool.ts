'use server';
/**
 * @fileOverview A Genkit flow that generates an AI-voiced preview of a given sentence.
 *
 * - ttsPreviewTool - A function that handles the text-to-speech generation process.
 * - TTSPreviewToolInput - The input type for the ttsPreviewTool function.
 * - TTSPreviewToolOutput - The return type for the ttsPreviewTool function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { Readable } from 'stream';
import wav from 'wav';

const TTSPreviewToolInputSchema = z.object({
  sentence: z.string().describe('The sentence to convert to speech.'),
});
export type TTSPreviewToolInput = z.infer<typeof TTSPreviewToolInputSchema>;

const TTSPreviewToolOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The AI-generated audio of the sentence, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TTSPreviewToolOutput = z.infer<typeof TTSPreviewToolOutputSchema>;

/**
 * Converts PCM audio data to WAV format.
 *
 * @param pcmData The PCM audio data as a Buffer.
 * @param channels Number of audio channels (default: 1).
 * @param rate Sample rate in Hz (default: 24000).
 * @param sampleWidth Sample width in bytes (default: 2).
 * @returns A Promise that resolves to the Base64 encoded WAV audio string.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

export async function ttsPreviewTool(input: TTSPreviewToolInput): Promise<TTSPreviewToolOutput> {
  return ttsPreviewFlow(input);
}

const ttsPreviewFlow = ai.defineFlow(
  {
    name: 'ttsPreviewFlow',
    inputSchema: TTSPreviewToolInputSchema,
    outputSchema: TTSPreviewToolOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A pleasant, default voice
          },
        },
      },
      prompt: input.sentence,
    });

    if (!media) {
      throw new Error('No audio media returned from TTS model.');
    }

    // The media.url for audio is typically 'data:audio/x-pcm;base64,<pcm_data>'
    // We need to extract the base64 PCM data and convert it to WAV.
    const base64Pcm = media.url.substring(media.url.indexOf(',') + 1);
    const audioBuffer = Buffer.from(base64Pcm, 'base64');

    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
