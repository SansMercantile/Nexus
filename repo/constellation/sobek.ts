export const SobekKernel = {
  id: 'Sobek',
  name: 'Sobek',
  subtitle: 'Threat Detection & Cybersecurity',
  description:
    'Sobek is the constellation kernel designed to protect candidate exams and enterprise operations through continuous monitoring, anomaly detection, and threat intelligence.',
  category: 'Security',
  proctoring: {
    requiredExtension: 'Proctorio',
    video: true,
    audio: true,
    screenShare: true,
    antiCheat: [
      'copyPaste',
      'tabSwitching',
      'backgroundAppDetection',
      'unauthorizedExtensions',
    ],
  },
};
