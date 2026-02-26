
export interface UniversalLaw {
  id: string;
  name: string;
  category: string;
  summary: string;
  resonance: 'Physical' | 'Mental' | 'Spiritual' | 'Cosmic';
}

export const UNIVERSAL_LAWS: UniversalLaw[] = [
  // 🌀 Core Universal Laws
  { id: 'core-1', name: 'Law of Divine Oneness', category: 'Core Foundational', resonance: 'Spiritual', summary: 'Everything in the universe is interconnected. Every thought, action, and event is connected to everything else.' },
  { id: 'core-2', name: 'Law of Vibration', category: 'Core Foundational', resonance: 'Cosmic', summary: 'Everything in the Universe moves, vibrates, and travels in circular patterns.' },
  { id: 'core-3', name: 'Law of Correspondence', category: 'Core Foundational', resonance: 'Mental', summary: 'As above, so below; as within, so without. The patterns of the cosmos are reflected in the individual.' },
  { id: 'core-4', name: 'Law of Attraction', category: 'Core Foundational', resonance: 'Cosmic', summary: 'Like attracts like. You project energy that returns to you in kind.' },
  { id: 'core-5', name: 'Law of Inspired Action', category: 'Core Foundational', resonance: 'Physical', summary: 'Manifestation requires the internal guidance of intuition paired with physical movement.' },
  { id: 'core-6', name: 'Law of Perpetual Transmutation of Energy', category: 'Core Foundational', resonance: 'Cosmic', summary: 'Energy is always in motion and can be transformed from one form to another.' },
  { id: 'core-7', name: 'Law of Cause and Effect', category: 'Core Foundational', resonance: 'Physical', summary: 'Nothing happens by chance. Every action has a specific reaction or consequence.' },
  { id: 'core-8', name: 'Law of Compensation', category: 'Core Foundational', resonance: 'Physical', summary: 'The universe provides based on the value you contribute to the whole.' },
  { id: 'core-9', name: 'Law of Relativity', category: 'Core Foundational', resonance: 'Mental', summary: 'Everything is neutral until we assign it a meaning through comparison.' },
  { id: 'core-10', name: 'Law of Polarity', category: 'Core Foundational', resonance: 'Mental', summary: 'Everything has an opposite. Contrast allows for the perception of reality.' },
  { id: 'core-11', name: 'Law of Rhythm', category: 'Core Foundational', resonance: 'Cosmic', summary: 'Everything moves in cycles and seasons. Understanding the pendulum is key to mastery.' },
  { id: 'core-12', name: 'Law of Gender', category: 'Core Foundational', resonance: 'Cosmic', summary: 'Masculine and feminine energies exist in all things; balance is required for creation.' },

  // 🌌 Spiritual Laws of the Soul
  { id: 'soul-1', name: 'Law of Evolution', category: 'Spiritual Soul', resonance: 'Spiritual', summary: 'The soul is on a permanent trajectory toward higher complexity and awareness.' },
  { id: 'soul-2', name: 'Law of Karma', category: 'Spiritual Soul', resonance: 'Cosmic', summary: 'The sum of a person\'s actions in this and previous states of existence.' },
  { id: 'soul-3', name: 'Law of Grace', category: 'Spiritual Soul', resonance: 'Spiritual', summary: 'Divine intervention that transcends the mechanical Law of Karma through forgiveness.' },
  { id: 'soul-4', name: 'Law of Reincarnation', category: 'Spiritual Soul', resonance: 'Spiritual', summary: 'The cycle of rebirth allowing the soul to experience multiple facets of existence.' },
  { id: 'soul-5', name: 'Law of Forgiveness', category: 'Spiritual Soul', resonance: 'Mental', summary: 'Releasing energetic debts to free the self from lower-vibrational loops.' },
  { id: 'soul-6', name: 'Law of Free Will', category: 'Spiritual Soul', resonance: 'Mental', summary: 'The absolute right of the soul to choose its path and responses.' },
  { id: 'soul-7', name: 'Law of Soul Contracts', category: 'Spiritual Soul', resonance: 'Spiritual', summary: 'Pre-incarnation agreements with other souls for mutual growth.' },
  { id: 'soul-8', name: 'Law of Spiritual Progression', category: 'Spiritual Soul', resonance: 'Spiritual', summary: 'The natural drive to ascend toward the Source.' },
  { id: 'soul-9', name: 'Law of Intention', category: 'Spiritual Soul', resonance: 'Mental', summary: 'The direction of consciousness that initiates the creative process.' },
  { id: 'soul-10', name: 'Law of Divine Timing', category: 'Spiritual Soul', resonance: 'Cosmic', summary: 'The perfect orchestration of events outside of linear human time.' },
  { id: 'soul-11', name: 'Law of Detachment', category: 'Spiritual Soul', resonance: 'Mental', summary: 'The ability to release the outcome while maintaining the intention.' },
  { id: 'soul-12', name: 'Law of Inner Knowing', category: 'Spiritual Soul', resonance: 'Spiritual', summary: 'Trusting the direct gnosis of the higher self over external data.' },
  { id: 'soul-13', name: 'Law of Presence', category: 'Spiritual Soul', resonance: 'Mental', summary: 'Power exists only in the "Now" moment.' },

  // 🧠 Mental and Emotional Laws
  { id: 'mental-1', name: 'Law of Mentalism', category: 'Mental/Emotional', resonance: 'Mental', summary: 'The All is Mind; the Universe is Mental.' },
  { id: 'mental-2', name: 'Law of Belief', category: 'Mental/Emotional', resonance: 'Mental', summary: 'What you truly believe to be true becomes your reality.' },
  { id: 'mental-3', name: 'Law of Focus', category: 'Mental/Emotional', resonance: 'Mental', summary: 'Where attention goes, energy flows and results grow.' },
  { id: 'mental-4', name: 'Law of Visualization', category: 'Mental/Emotional', resonance: 'Mental', summary: 'Mental imagery acts as a blueprint for energetic manifestation.' },
  { id: 'mental-5', name: 'Law of Mind-Body Connection', category: 'Mental/Emotional', resonance: 'Physical', summary: 'Thoughts manifest as physical sensations and biological health.' },
  { id: 'mental-6', name: 'Law of Reflection', category: 'Mental/Emotional', resonance: 'Mental', summary: 'The external world reflects your internal state of being.' },
  { id: 'mental-7', name: 'Law of Acceptance', category: 'Mental/Emotional', resonance: 'Mental', summary: 'Resistance creates suffering; acceptance allows for transformation.' },
  { id: 'mental-8', name: 'Law of Expectation', category: 'Mental/Emotional', resonance: 'Mental', summary: 'Whatever you expect with confidence becomes your own self-fulfilling prophecy.' },
  { id: 'mental-9', name: 'Law of Subconscious Programming', category: 'Mental/Emotional', resonance: 'Mental', summary: 'The secondary mind drives 95% of reality through automated patterns.' },
  { id: 'mental-10', name: 'Law of Emotional Guidance', category: 'Mental/Emotional', resonance: 'Mental', summary: 'Emotions are feedback signals indicating alignment or misalignment with the Higher Self.' },
  { id: 'mental-11', name: 'Law of Self-Concept', category: 'Mental/Emotional', resonance: 'Mental', summary: 'The identity you hold for yourself dictates the limits of your achievement.' },
  { id: 'mental-12', name: 'Law of Gratitude', category: 'Mental/Emotional', resonance: 'Mental', summary: 'The frequency of appreciation signals to the universe that you already have abundance.' },
  { id: 'mental-13', name: 'Law of Clarity', category: 'Mental/Emotional', resonance: 'Mental', summary: 'The Universe requires specific instructions to deliver specific results.' },

  // 🌿 Laws of Nature and Manifestation
  { id: 'nature-1', name: 'Law of Seedtime and Harvest', category: 'Nature/Manifestation', resonance: 'Physical', summary: 'There is a necessary delay between planting an intention and reaping the result.' },
  { id: 'nature-2', name: 'Law of Least Effort', category: 'Nature/Manifestation', resonance: 'Physical', summary: 'Nature does not hurry, yet everything is accomplished through flow.' },
  { id: 'nature-3', name: 'Law of Pure Potentiality', category: 'Nature/Manifestation', resonance: 'Spiritual', summary: 'At our core, we are pure consciousness—unlimited and infinite.' },
  { id: 'nature-4', name: 'Law of Giving and Receiving', category: 'Nature/Manifestation', resonance: 'Cosmic', summary: 'To receive, one must be in a state of open circulation, ready to give.' },
  { id: 'nature-5', name: 'Law of Circulation', category: 'Nature/Manifestation', resonance: 'Physical', summary: 'Stagnation creates decay; energy must flow to remain vital.' },
  { id: 'nature-6', name: 'Law of Action-Reaction', category: 'Nature/Manifestation', resonance: 'Physical', summary: 'Every force applied to reality triggers an equal return force.' },
  { id: 'nature-7', name: 'Law of Magnetism', category: 'Nature/Manifestation', resonance: 'Cosmic', summary: 'You do not get what you want; you get what you are.' },
  { id: 'nature-8', name: 'Law of Expansion', category: 'Nature/Manifestation', resonance: 'Cosmic', summary: 'The fundamental nature of the universe is to grow and become more.' },
  { id: 'nature-9', name: 'Law of Abundance', category: 'Nature/Manifestation', resonance: 'Cosmic', summary: 'Scarcity is an illusion; the universe is infinitely resourceful.' },
  { id: 'nature-10', name: 'Law of Multiplication', category: 'Nature/Manifestation', resonance: 'Cosmic', summary: 'Whatever is focused on and appreciated will multiply in frequency.' },
  { id: 'nature-11', name: 'Law of Calibration', category: 'Nature/Manifestation', resonance: 'Mental', summary: 'Adjusting your internal frequency to match the desired reality.' },
  { id: 'nature-12', name: 'Law of Magnetic Resonance', category: 'Nature/Manifestation', resonance: 'Cosmic', summary: 'Two things of similar vibration will naturally pull toward one another.' },

  // ⚖️ Laws of Integrity and Alignment
  { id: 'integrity-1', name: 'Law of Truth', category: 'Integrity/Alignment', resonance: 'Mental', summary: 'Universal truths are constant and unchanging; human truths are perspectives.' },
  { id: 'integrity-2', name: 'Law of Honesty', category: 'Integrity/Alignment', resonance: 'Mental', summary: 'Alignment of word, thought, and deed creates a powerful energetic signature.' },
  { id: 'integrity-3', name: 'Law of Harmony', category: 'Integrity/Alignment', resonance: 'Cosmic', summary: 'Disturbing the natural order requires a correction by the universe.' },
  { id: 'integrity-4', name: 'Law of Alignment', category: 'Integrity/Alignment', resonance: 'Spiritual', summary: 'Being in the right place, at the right time, for the right reason.' },
  { id: 'integrity-5', name: 'Law of Integrity', category: 'Integrity/Alignment', resonance: 'Mental', summary: 'Wholeness and consistency in character builds spiritual authority.' },
  { id: 'integrity-6', name: 'Law of Justice', category: 'Integrity/Alignment', resonance: 'Cosmic', summary: 'The cosmic balance that ensures fairness over long temporal spans.' },
  { id: 'integrity-7', name: 'Law of Divine Order', category: 'Integrity/Alignment', resonance: 'Cosmic', summary: 'Even in chaos, there is a hidden pattern working for the highest good.' },
  { id: 'integrity-8', name: 'Law of Authenticity', category: 'Integrity/Alignment', resonance: 'Spiritual', summary: 'The most powerful vibration is your own unique, unfiltered soul frequency.' },
  { id: 'integrity-9', name: 'Law of Responsibility', category: 'Integrity/Alignment', resonance: 'Mental', summary: 'You are the sole author of your experience and your reactions.' },
  { id: 'integrity-10', name: 'Law of Self-Mastery', category: 'Integrity/Alignment', resonance: 'Mental', summary: 'The conquest of the lower self by the Higher Self.' },

  // 💫 Cosmic & Energetic Laws
  { id: 'cosmic-1', name: 'Law of Light', category: 'Cosmic/Energetic', resonance: 'Cosmic', summary: 'Information and consciousness travel through the medium of light.' },
  { id: 'cosmic-2', name: 'Law of Sound', category: 'Cosmic/Energetic', resonance: 'Cosmic', summary: 'Vibration manifests as audible and inaudible frequency structures.' },
  { id: 'cosmic-3', name: 'Law of Color', category: 'Cosmic/Energetic', resonance: 'Cosmic', summary: 'Specific light frequencies influence psychology and energy centers.' },
  { id: 'cosmic-4', name: 'Law of Numbers (Numerology)', category: 'Cosmic/Energetic', resonance: 'Mental', summary: 'Numbers are the fundamental code of the Matrix.' },
  { id: 'cosmic-5', name: 'Law of Frequency Match', category: 'Cosmic/Energetic', resonance: 'Cosmic', summary: 'You cannot perceive what you do not vibrate.' },
  { id: 'cosmic-6', name: 'Law of Entanglement', category: 'Cosmic/Energetic', resonance: 'Cosmic', summary: 'Souls that have interacted remain connected across space and time.' },
  { id: 'cosmic-7', name: 'Law of Quantum Jumping', category: 'Cosmic/Energetic', resonance: 'Cosmic', summary: 'The ability to shift consciousness into a different probable timeline.' },
  { id: 'cosmic-8', name: 'Law of Dimensionality', category: 'Cosmic/Energetic', resonance: 'Cosmic', summary: 'Reality exists in layers of varying density and consciousness.' },
  { id: 'cosmic-9', name: 'Law of Telepathy', category: 'Cosmic/Energetic', resonance: 'Mental', summary: 'Non-local communication between minds through the ether.' },
  { id: 'cosmic-10', name: 'Law of Bioenergetics', category: 'Cosmic/Energetic', resonance: 'Physical', summary: 'The study of energy flow through living systems.' },
  { id: 'cosmic-11', name: 'Law of Synchronicity', category: 'Cosmic/Energetic', resonance: 'Cosmic', summary: 'Meaningful coincidences are signals of alignment.' },
  { id: 'cosmic-12', name: 'Law of Fractals', category: 'Cosmic/Energetic', resonance: 'Cosmic', summary: 'The whole is contained in every part; complexity repeats.' },

  // 🔮 Mystical, Metaphysical & Occult Laws
  { id: 'mystic-1', name: 'Law of Alchemy', category: 'Mystical/Occult', resonance: 'Spiritual', summary: 'Transmuting base lead (ego) into spiritual gold (soul).' },
  { id: 'mystic-2', name: 'Law of Symbols', category: 'Mystical/Occult', resonance: 'Mental', summary: 'Visual codes that bypass the conscious mind to trigger the subconscious.' },
  { id: 'mystic-3', name: 'Law of Vortex Energy', category: 'Mystical/Occult', resonance: 'Cosmic', summary: 'Power concentrated in spinning spirals of energetic force.' },
  { id: 'mystic-4', name: 'Law of Sacred Geometry', category: 'Mystical/Occult', resonance: 'Cosmic', summary: 'The mathematical architecture of the physical universe.' },
  { id: 'mystic-5', name: 'Law of Archetypes', category: 'Mystical/Occult', resonance: 'Mental', summary: 'Primal patterns of human behavior stored in the collective unconscious.' },
  { id: 'mystic-6', name: 'Law of Ritual', category: 'Mystical/Occult', resonance: 'Physical', summary: 'Intentional acts that bridge the physical and spiritual worlds.' },
  { id: 'mystic-7', name: 'Law of the Akasha (Ether)', category: 'Mystical/Occult', resonance: 'Cosmic', summary: 'The celestial record of every thought and action ever taken.' },
  { id: 'mystic-8', name: 'Law of Mirrors', category: 'Mystical/Occult', resonance: 'Mental', summary: 'What you dislike in others is a projection of an unintegrated part of yourself.' },
  { id: 'mystic-9', name: 'Law of Projection', category: 'Mystical/Occult', resonance: 'Mental', summary: 'Reality is a subjective hologram projected by your internal state.' },
  { id: 'mystic-10', name: 'Law of Initiation', category: 'Mystical/Occult', resonance: 'Spiritual', summary: 'Tests of character that must be passed to reach higher awareness.' },
  { id: 'mystic-11', name: 'Law of Sacred Contracts', category: 'Mystical/Occult', resonance: 'Spiritual', summary: 'Binding agreements made with the Divine before birth.' },
  { id: 'mystic-12', name: 'Law of the Observer Effect', category: 'Mystical/Occult', resonance: 'Cosmic', summary: 'The act of observing reality changes the outcome of the reality.' },

  // 🧬 Laws of Personal Power & Creation
  { id: 'power-1', name: 'Law of Desire', category: 'Power/Creation', resonance: 'Mental', summary: 'Desire is the primary motivator for the soul\'s growth and expression.' },
  { id: 'power-2', name: 'Law of Manifestation', category: 'Power/Creation', resonance: 'Cosmic', summary: 'The process of turning thought into physical matter.' },
  { id: 'power-3', name: 'Law of Alignment over Hustle', category: 'Power/Creation', resonance: 'Spiritual', summary: 'Vibrational resonance achieves more than physical labor.' },
  { id: 'power-4', name: 'Law of Embodiment', category: 'Power/Creation', resonance: 'Physical', summary: 'To manifest a reality, you must become the person living that reality.' },
  { id: 'power-5', name: 'Law of Receiving', category: 'Power/Creation', resonance: 'Mental', summary: 'The capacity to allow goodness without feeling a need to "earn" it.' },
  { id: 'power-6', name: 'Law of Will', category: 'Power/Creation', resonance: 'Mental', summary: 'Concentrated determination used to direct energy.' },
  { id: 'power-7', name: 'Law of Confidence', category: 'Power/Creation', resonance: 'Mental', summary: 'Absolute certainty in the unseen creates the seen.' },
  { id: 'power-8', name: 'Law of Energy Exchange', category: 'Power/Creation', resonance: 'Physical', summary: 'Value must be exchanged for value to maintain cosmic balance.' },
  { id: 'power-9', name: 'Law of Personal Frequency', category: 'Power/Creation', resonance: 'Cosmic', summary: 'Your dominant vibe determines your experiences and social circle.' },
  { id: 'power-10', name: 'Law of Leadership', category: 'Power/Creation', resonance: 'Mental', summary: 'Mastering yourself allows you to influence the collective field.' },
  { id: 'power-11', name: 'Law of Momentum', category: 'Power/Creation', resonance: 'Physical', summary: 'Success builds upon success; the first step is the hardest.' },
  { id: 'power-12', name: 'Law of Resonance', category: 'Power/Creation', resonance: 'Cosmic', summary: 'You naturally drift toward things and people with a similar vibration.' },

  // 🧘🏽‍♀️ Laws of Healing & Transformation
  { id: 'healing-1', name: 'Law of Healing', category: 'Healing/Transformation', resonance: 'Physical', summary: 'The body\'s natural state is health; healing is the removal of blockage.' },
  { id: 'healing-2', name: 'Law of Transmutation', category: 'Healing/Transformation', resonance: 'Cosmic', summary: 'Changing lower frequencies of pain into higher frequencies of wisdom.' },
  { id: 'healing-3', name: 'Law of Wholeness', category: 'Healing/Transformation', resonance: 'Spiritual', summary: 'Integration of the shadow and the light into a single being.' },
  { id: 'healing-4', name: 'Law of Cellular Memory', category: 'Healing/Transformation', resonance: 'Physical', summary: 'Trauma and wisdom are stored within the physical cells of the body.' },
  { id: 'healing-5', name: 'Law of Conscious Creation', category: 'Healing/Transformation', resonance: 'Mental', summary: 'Moving from reactive living to proactive reality design.' },
  { id: 'healing-6', name: 'Law of Breath', category: 'Healing/Transformation', resonance: 'Physical', summary: 'The bridge between the spirit and the body; the primary energy intake.' },
  { id: 'healing-7', name: 'Law of Presence in Pain', category: 'Healing/Transformation', resonance: 'Spiritual', summary: 'Facing suffering directly allows it to dissolve into understanding.' },
  { id: 'healing-8', name: 'Law of Surrender', category: 'Healing/Transformation', resonance: 'Spiritual', summary: 'Giving up control to the Higher Self to allow for a better outcome.' },
  { id: 'healing-9', name: 'Law of Faith', category: 'Healing/Transformation', resonance: 'Spiritual', summary: 'Knowing that the outcome is already secured in the energetic realm.' },
  { id: 'healing-10', name: 'Law of Renewal', category: 'Healing/Transformation', resonance: 'Cosmic', summary: 'The universe constantly recreates itself; you can always start over.' },

  // 🌈 Laws of Unity and Higher Consciousness
  { id: 'unity-1', name: 'Law of Oneness in Diversity', category: 'Unity/Consciousness', resonance: 'Spiritual', summary: 'Seeing the single source behind the infinite variety of forms.' },
  { id: 'unity-2', name: 'Law of Unity Consciousness', category: 'Unity/Consciousness', resonance: 'Cosmic', summary: 'Transcending "us vs them" to see the "We" of the universe.' },
  { id: 'unity-3', name: 'Law of Cosmic Love', category: 'Unity/Consciousness', resonance: 'Spiritual', summary: 'Love is the fundamental cohesive force holding atoms and stars together.' },
  { id: 'unity-4', name: 'Law of Ascension', category: 'Unity/Consciousness', resonance: 'Cosmic', summary: 'The gradual increase of frequency to exist in higher dimensions of light.' }
];

export function getLawOfTheDay(): UniversalLaw {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return UNIVERSAL_LAWS[dayOfYear % UNIVERSAL_LAWS.length];
}
