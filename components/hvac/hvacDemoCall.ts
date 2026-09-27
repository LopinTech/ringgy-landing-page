import type { CallLine } from "../CallPlayer";

const clip = (file: string, duration: number) => ({ src: `/audio/hvac-demo/${file}.mp3`, duration });

/**
 * Pre-recorded HVAC demo call for the hero player. Audio lives in
 * public/audio/hvac-demo/; durations (seconds) are measured from the MP3s so
 * the timeline is correct before any clip loads.
 */
export const HVAC_DEMO_CALL: CallLine[] = [
  ["Ringgy", "Thanks for calling Northside Heating & Air. This is Ringgy. How can I help you today?", clip("ringgy-con-1", 5.25)],
  ["Customer", "Hi, my AC isn’t really cooling the house. It’s been running for hours, but it’s still pretty warm inside.", clip("customer-con-1", 6.64)],
  ["Ringgy", "I’m sorry you’re dealing with that. I can help get a technician scheduled. Is the system running but blowing warm air, or is it not turning on at all?", clip("ringgy-con-2", 9.33)],
  ["Customer", "It’s running, but the air coming out isn’t cold.", clip("customer-con-2", 3.0)],
  ["Ringgy", "Got it. Let me get a few details so I can find the right appointment for you. What’s your name?", clip("ringgy-con-3", 6.09)],
  ["Customer", "It’s Michael Johnson.", clip("customer-con-3", 1.49)],
  ["Ringgy", "Thanks, Michael. And what’s the best phone number to reach you?", clip("ringgy-con-4", 3.34)],
  ["Customer", "214-555-0187.", clip("customer-con-4", 3.79)],
  ["Ringgy", "Got it, 214-555-0187. What’s the address where the AC is having trouble?", clip("ringgy-con-5", 8.86)],
  ["Customer", "1847 Oakwood Drive, Dallas, Texas 75201.", clip("customer-con-5", 5.88)],
  ["Ringgy", "Thanks. I have 1847 Oakwood Drive, Dallas, Texas 75201. Is that correct?", clip("ringgy-con-6", 9.09)],
  ["Customer", "Yes, that’s right.", clip("customer-con-6", 1.25)],
  ["Ringgy", "Perfect. I have an opening today between 2 and 4 PM. Would that work for you?", clip("ringgy-con-7", 5.93)],
  ["Customer", "Yes, that would be great.", clip("customer-con-7", 1.62)],
  [
    "Ringgy",
    "Great. Just to confirm, I have Michael Johnson, phone number 214-555-0187, at 1847 Oakwood Drive, Dallas, Texas 75201, for an AC no-cooling service call today between 2 and 4 PM. Is everything correct?",
    clip("ringgy-con-8", 22.18),
  ],
  ["Customer", "Yes, that’s correct.", clip("customer-con-8", 1.44)],
  [
    "Ringgy",
    "You’re all set, Michael. Your appointment is booked for today between 2 and 4 PM. We’ll send a confirmation to 214-555-0187. Is there anything else I can help you with?",
    clip("ringgy-con-9", 15.46),
  ],
  ["Customer", "No, that’s everything. Thank you.", clip("customer-con-9", 2.32)],
  ["Ringgy", "You’re welcome. We’ll see you this afternoon. Have a great day!", clip("ringgy-con-10", 4.02)],
];
