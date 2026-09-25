let context: AudioContext | null = null
let master: GainNode | null = null

function ensureGraph() {
  if (context && master) return
  context = new AudioContext()
  master = context.createGain()
  master.gain.value = 0
  master.connect(context.destination)

  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 420
  filter.Q.value = 0.7
  filter.connect(master)

  const oscA = context.createOscillator()
  oscA.type = 'sine'
  oscA.frequency.value = 110
  const oscB = context.createOscillator()
  oscB.type = 'triangle'
  oscB.frequency.value = 110.75

  const gainA = context.createGain()
  gainA.gain.value = 0.16
  const gainB = context.createGain()
  gainB.gain.value = 0.07
  oscA.connect(gainA)
  oscB.connect(gainB)
  gainA.connect(filter)
  gainB.connect(filter)

  const lfo = context.createOscillator()
  lfo.frequency.value = 0.08
  const lfoGain = context.createGain()
  lfoGain.gain.value = 70
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)

  oscA.start()
  oscB.start()
  lfo.start()
}

export async function setAmbientPlaying(playing: boolean) {
  ensureGraph()
  if (!context || !master) return
  if (context.state === 'suspended') await context.resume()
  const now = context.currentTime
  master.gain.cancelScheduledValues(now)
  master.gain.linearRampToValueAtTime(playing ? 0.22 : 0, now + 0.35)
}

export function disposeAmbient() {
  if (!context) return
  void context.close()
  context = null
  master = null
}
