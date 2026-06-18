// =============================================================
//  VERTICAL TYPING SPACE SHOOTER
//  Endless runner-style typing game with neon cyberpunk aesthetics
// =============================================================

// ─── ASSET CONFIGURATION ─────────────────────────────────────
// Replace these empty strings with actual image URLs/paths.
// If left empty, the game renders neon geometric fallbacks.
const PLAYER_SPACESHIP_SRC = 'assets/images/player.png';
const ALIEN_ENEMY_SRC = 'assets/images/alien.png';
const LUCKY_BOX_SRC = 'assets/images/luckybox.png';
const HEART_SRC = 'assets/images/heart.png';

// Preload images only if paths are provided
const IMAGES = {};
function preloadImage(key, src) {
  if (!src) return;
  const img = new Image();
  img.src = src;
  img.onload = () => { IMAGES[key] = img; };
}
preloadImage('player', PLAYER_SPACESHIP_SRC);
preloadImage('alien', ALIEN_ENEMY_SRC);
preloadImage('lucky', LUCKY_BOX_SRC);
preloadImage('heart', HEART_SRC);

// ─── AUDIO PLACEHOLDER SYSTEM ────────────────────────────────
// Each method is a stub ready to be wired up with new Audio().
const AudioFX = {
  playTyping() { const a = new Audio('assets/audio/ketik.mp3'); a.play().catch(() => { }); },
  playLaser() { const a = new Audio('assets/audio/laser.mp3'); a.play().catch(() => { }); },
  playExplosion() { const a = new Audio('assets/audio/ledakan.mp3'); a.play().catch(() => { }); },
  playBuff() { const a = new Audio('assets/audio/buff.mp3'); a.play().catch(() => { }); },
  playHeal() { /* Add heal audio if available */ },
  playHit() { /* new Audio('hit.mp3').play(); */ },
  playGameOver() { const a = new Audio('assets/audio/gameover.mp3'); a.play().catch(() => { }); },
};

// ─── WORD BANKS (scaled by difficulty, per language) ─────────
const WORD_BANKS_EN = {
  easy: [
    'ace', 'arm', 'bat', 'box', 'bug', 'cap', 'cow', 'cup', 'dew', 'dig',
    'dot', 'dug', 'elk', 'end', 'fan', 'fig', 'fog', 'fun', 'gap', 'gem',
    'gum', 'gut', 'hat', 'hex', 'hop', 'hub', 'ice', 'imp', 'ink', 'ion',
    'ivy', 'jam', 'jar', 'jaw', 'jet', 'jig', 'jot', 'joy', 'jug', 'keg',
    'key', 'kid', 'kit', 'lab', 'lap', 'law', 'leg', 'lid', 'lip', 'log',
    'lot', 'lug', 'map', 'mat', 'mix', 'mob', 'mop', 'mud', 'mug', 'nap',
    'net', 'nil', 'nod', 'nor', 'nut', 'oak', 'odd', 'oil', 'opt', 'orb',
    'ore', 'owl', 'pad', 'paw', 'peg', 'pen', 'pig', 'pin', 'pit', 'pod',
    'pot', 'pub', 'pun', 'rag', 'ram', 'ran', 'rap', 'rat', 'raw', 'red',
    'rib', 'rid', 'rim', 'rip', 'rod', 'rot', 'row', 'rug', 'rum', 'run',
    'rut', 'sap', 'sat', 'saw', 'set', 'sin', 'sip', 'sit', 'six', 'ski',
    'sob', 'sod', 'sum', 'sun', 'tab', 'tag', 'tan', 'tap', 'tar', 'tax',
    'ten', 'the', 'tie', 'tin', 'tip', 'toe', 'ton', 'top', 'tow', 'toy',
    'tub', 'tug', 'two', 'urn', 'van', 'vat', 'vet', 'vow', 'wag', 'war',
    'wax', 'web', 'wig', 'win', 'wit', 'wok', 'won', 'wry', 'yak', 'yam',
    'yap', 'yaw', 'yep', 'yet', 'yew', 'zip', 'zoo',
  ],
  medium: [
    'alpha', 'amber', 'anvil', 'armor', 'atlas', 'azure', 'basin', 'blast',
    'blaze', 'blink', 'bloom', 'brain', 'brave', 'brick', 'brisk', 'cable',
    'candy', 'cedar', 'chain', 'charm', 'chess', 'chill', 'china', 'civic',
    'claim', 'clash', 'clear', 'cliff', 'climb', 'cloud', 'cobra', 'comet',
    'coral', 'craft', 'crane', 'crash', 'crest', 'crown', 'crush', 'cubic',
    'curve', 'dance', 'debug', 'delta', 'depth', 'disco', 'draft', 'drain',
    'dream', 'drift', 'drone', 'dwarf', 'eagle', 'earth', 'elder', 'ember',
    'enact', 'epoch', 'equal', 'equip', 'erupt', 'event', 'exile', 'expat',
    'extra', 'fable', 'feast', 'fiber', 'flame', 'flare', 'flash', 'fleet',
    'flint', 'float', 'flora', 'fluid', 'forge', 'forth', 'frost', 'gleam',
    'globe', 'gloom', 'glyph', 'grain', 'grape', 'grasp', 'grind', 'guild',
    'haven', 'hazel', 'helix', 'honor', 'hover', 'humid', 'hyper', 'ivory',
    'jewel', 'joust', 'knack', 'kneel', 'kraft', 'lance', 'laser', 'latch',
    'layer', 'level', 'light', 'llama', 'lodge', 'logic', 'lunar', 'lyric',
    'magic', 'manor', 'maple', 'marsh', 'medal', 'mercy', 'metal', 'micro',
    'mimic', 'minor', 'mocha', 'model', 'moral', 'mount', 'music', 'nerve',
    'noble', 'north', 'novel', 'ocean', 'omega', 'onset', 'opera', 'optic',
    'orbit', 'oxide', 'ozone', 'panic', 'patch', 'pearl', 'phase', 'piano',
    'pilot', 'pixel', 'plank', 'plant', 'plaza', 'plumb', 'plume', 'polar',
    'power', 'prawn', 'pride', 'prime', 'print', 'prism', 'prize', 'probe',
    'proof', 'prose', 'proxy', 'pulse', 'quake', 'query', 'quest', 'quick',
    'quota', 'radar', 'rapid', 'raven', 'realm', 'reign', 'relay', 'ridge',
    'rival', 'robin', 'royal', 'rumba', 'saber', 'saint', 'salsa', 'scale',
    'scout', 'serif', 'shark', 'shelf', 'shift', 'sigma', 'sleek', 'slice',
    'slope', 'smart', 'smoke', 'snake', 'snare', 'solar', 'sonic', 'south',
    'space', 'spark', 'spawn', 'spear', 'spice', 'spike', 'spine', 'spoke',
    'squad', 'stack', 'staff', 'stage', 'stain', 'stake', 'stale', 'stamp',
    'stand', 'stark', 'steam', 'steel', 'steep', 'steer', 'stern', 'still',
    'stock', 'stoic', 'stone', 'storm', 'stout', 'stove', 'strap', 'straw',
    'strip', 'stump', 'super', 'surge', 'swamp', 'sweep', 'swift', 'sword',
    'talon', 'tempo', 'tiger', 'token', 'topaz', 'total', 'tower', 'trace',
    'track', 'trade', 'trail', 'train', 'trait', 'trend', 'triad', 'trial',
    'trick', 'trine', 'troop', 'truce', 'trunk', 'trust', 'tulip', 'turbo',
    'tweed', 'twist', 'ultra', 'umbra', 'unify', 'unity', 'until', 'upper',
    'urban', 'usher', 'utter', 'vague', 'valve', 'vault', 'vigor', 'vinyl',
    'viper', 'virus', 'visor', 'vista', 'vital', 'vivid', 'vocal', 'voice',
    'voter', 'vowel', 'watch', 'water', 'wheat', 'whirl', 'wield', 'witch',
    'world', 'wound', 'wrath', 'yacht', 'yield', 'youth', 'zebra', 'zonal',
  ],
  hard: [
    'alchemy', 'android', 'anomaly', 'apostle', 'archive', 'arsenal',
    'balance', 'banshee', 'battery', 'beacon', 'blanket', 'blazing',
    'blister', 'booster', 'capsule', 'cardiac', 'cascade', 'celsius',
    'chamber', 'channel', 'chapter', 'chariot', 'chimera', 'circuit',
    'cluster', 'coaster', 'cockpit', 'compile', 'complex', 'console',
    'contest', 'control', 'convert', 'crystal', 'current', 'crusade',
    'cyclone', 'datalog', 'decibel', 'decrypt', 'defense', 'destiny',
    'diamond', 'digital', 'discord', 'display', 'distort', 'dolphin',
    'dynasty', 'eclipse', 'element', 'embargo', 'encrypt', 'entropy',
    'episode', 'erosion', 'exploit', 'extract', 'falafel', 'fallout',
    'fantasy', 'fiction', 'firefly', 'fission', 'flannel', 'flexion',
    'formula', 'fortune', 'freight', 'furnace', 'gadget', 'galahad',
    'gateway', 'genesis', 'glacier', 'granite', 'gravity', 'griffin',
    'habitat', 'halcyon', 'handoff', 'harmony', 'harvest', 'heretic',
    'hexagon', 'holster', 'horizon', 'hostile', 'hydrant', 'hypnotic',
    'iceberg', 'igniter', 'illusion', 'imaging', 'implant', 'impulse',
    'inferno', 'insight', 'install', 'ionizer', 'javelin', 'jigsaw',
    'journal', 'jubilee', 'justice', 'ketchup', 'kingdom', 'kinetic',
    'kitchen', 'lantern', 'lattice', 'leather', 'liberty', 'lighten',
    'lockout', 'maestro', 'magnate', 'mandala', 'martial', 'masking',
    'maximum', 'mercury', 'militia', 'mineral', 'mission', 'mixture',
    'modular', 'monitor', 'monsoon', 'monster', 'morning', 'mystery',
    'nebula', 'neptune', 'network', 'neutron', 'nitrate', 'nuclear',
    'nucleus', 'nullify', 'obelisk', 'obscure', 'optimal', 'organic',
    'origami', 'outpost', 'overdub', 'ovation', 'oxidize', 'package',
    'paddock', 'paradox', 'passage', 'patriot', 'payload', 'penalty',
    'pension', 'peptide', 'phantom', 'pilgrim', 'planner', 'plastic',
    'platoon', 'plunder', 'polygon', 'popcorn', 'precept', 'presage',
    'problem', 'procure', 'prodigy', 'profile', 'project', 'protect',
    'protest', 'protons', 'provoke', 'pyramid', 'quantum', 'quarrel',
    'radical', 'rampart', 'reactor', 'rebound', 'recital', 'refract',
    'refugee', 'remnant', 'require', 'resolve', 'revolve', 'ripcord',
    'runtime', 'rupture', 'salvage', 'scandal', 'scarlet', 'scatter',
    'scourge', 'segment', 'shelter', 'shuttle', 'silicon', 'sinuous',
    'skeptic', 'society', 'solvent', 'species', 'stadium', 'stealth',
    'storage', 'stratum', 'subject', 'subsidy', 'sunrise', 'surplus',
    'suspend', 'symbiont', 'synapse', 'tabloid', 'takeoff', 'tempest',
    'theorem', 'therapy', 'thermal', 'thunder', 'topiary', 'torpedo',
    'torsion', 'tracker', 'trading', 'transit', 'trigger', 'tropics',
    'tsunami', 'turbine', 'tweaker', 'twister', 'unicorn', 'uniform',
    'unleash', 'uranium', 'utility', 'vaccine', 'vagrant', 'vanguard',
    'venture', 'verdict', 'version', 'vertigo', 'veteran', 'villain',
    'vintage', 'voltage', 'vortex', 'vulture', 'warhead', 'warrior',
    'whisker', 'whistle', 'widgeon', 'wildcat', 'witness', 'wrangle',
    'xchange', 'yielded', 'zealous', 'zephyr', 'zenith',
  ],
  expert: [
    'absolute', 'abstract', 'accuracy', 'advanced', 'advisory',
    'advocate', 'aircraft', 'alchemic', 'alliance', 'almanack',
    'ambiance', 'amusedly', 'analysis', 'ancestor', 'antidote',
    'aperture', 'aquarium', 'artifice', 'assassin', 'backbone',
    'bacteria', 'ballroom', 'bankrupt', 'biomorph', 'blackout',
    'blizzard', 'boundary', 'bracelet', 'broadest', 'bulkhead',
    'calendar', 'campaign', 'capsicum', 'cardinal', 'catalyst',
    'category', 'cerebral', 'champion', 'chapters', 'checkbox',
    'chromium', 'claymore', 'cliffhanger', 'cockerel', 'collider',
    'comeback', 'compiler', 'compound', 'computer', 'concrete',
    'conquest', 'contract', 'controls', 'copyhold', 'corridor',
    'crossbow', 'crucible', 'cultural', 'currency', 'cyberpunk',
    'database', 'deadline', 'debugger', 'decimate', 'defender',
    'diagnose', 'dialogue', 'diplomat', 'discount', 'dispatch',
    'dividend', 'doctrine', 'document', 'dominant', 'dominion',
    'doorstep', 'download', 'dreadful', 'dropship', 'dynamite',
    'eclipsed', 'eighteen', 'electron', 'eloquent', 'embedded',
    'emigrant', 'emphatic', 'encoding', 'endpoint', 'enforced',
    'engulfed', 'enormous', 'envelope', 'equation', 'equipped',
    'espresso', 'eternity', 'evaluate', 'eventful', 'evidence',
    'exchange', 'excludes', 'exercise', 'expedite', 'explorer',
    'external', 'extremes', 'fabulous', 'facedown', 'failsafe',
    'familiar', 'fastball', 'featured', 'feedback', 'filename',
    'finalize', 'finished', 'firmware', 'flagship', 'flashgun',
    'flexible', 'folklore', 'footstep', 'forecast', 'forensic',
    'fragment', 'freefall', 'frequent', 'frontier', 'fullback',
    'function', 'futility', 'gatepost', 'genocide', 'gigabyte',
    'gladiola', 'globetrotter', 'glossary', 'graphene', 'greenery',
    'gridlock', 'guardian', 'guidance', 'gunsmith', 'gyratory',
    'halftime', 'handbook', 'handmade', 'handover', 'hardcore',
    'hardware', 'harmonic', 'headband', 'headline', 'helpline',
    'heritage', 'highrise', 'hologram', 'homeland', 'horseman',
    'hospital', 'humanoid', 'huntsman', 'hydrogen', 'hysteria',
    'icebound', 'ignition', 'illusive', 'imagined', 'immunity',
    'imperial', 'incident', 'indulged', 'industry', 'infrared',
    'inherent', 'injector', 'innocent', 'inscribe', 'insignia',
    'integral', 'interact', 'interior', 'interval', 'invasion',
    'invented', 'invoking', 'iodizing', 'isolated', 'issuing',
    'jailbird', 'jamboree', 'japanese', 'jettison', 'judgment',
    'junction', 'keepsake', 'keyboard', 'khaki', 'knockout',
    'labeling', 'lambchop', 'landmark', 'language', 'latitude',
    'lavender', 'layabout', 'leapfrog', 'leverage', 'licensed',
    'lifelong', 'ligature', 'limiting', 'linkable', 'literacy',
    'lockdown', 'longhand', 'luminous', 'magnetic', 'mainland',
    'majestic', 'manifest', 'maritime', 'mastered', 'matchbox',
    'maximise', 'mechanic', 'medicine', 'membrane', 'memorial',
    'merchant', 'metadata', 'milepost', 'minimize', 'minority',
    'modifier', 'moisture', 'molecule', 'momentum', 'monopoly',
    'monument', 'mortgage', 'multiply', 'mustache', 'mutation',
    'navigate', 'notebook', 'nucleus', 'numerous', 'obituary',
    'obligate', 'obstacle', 'occupied', 'offshoot', 'onscreen',
    'operated', 'opponent', 'opposing', 'optimise', 'optional',
    'organism', 'original', 'orthodox', 'outbreak', 'outreach',
    'overcome', 'overhead', 'overload', 'overlord', 'overtake',
    'paradigm', 'parallel', 'paranoid', 'particle', 'passport',
    'patience', 'peculiar', 'pendulum', 'pentagon', 'perceive',
    'persists', 'personal', 'petition', 'pipeline', 'platform',
    'playback', 'pleasure', 'polished', 'populist', 'portable',
    'position', 'positive', 'powerful', 'preclude', 'predator',
    'preserve', 'pressure', 'presumed', 'proceeds', 'producer',
    'profound', 'progress', 'prohibit', 'prologue', 'promptly',
    'properly', 'proposal', 'prospect', 'protocol', 'provider',
    'publicly', 'pullback', 'punitive', 'purchase', 'pursuant',
    'puzzling', 'quadrant', 'quantify', 'quantity', 'question',
    'quotient',
  ],
};

// ─── INDONESIAN WORD BANKS ───────────────────────────────────
const WORD_BANKS_ID = {
  easy: [
    'abu', 'ada', 'air', 'aku', 'api', 'apa', 'ara', 'asa', 'ban', 'bak',
    'bau', 'bab', 'bah', 'bel', 'bis', 'bom', 'bor', 'bos', 'bui', 'bun',
    'bus', 'cap', 'cat', 'dam', 'dan', 'dom', 'doa', 'dua', 'ego', 'era',
    'flu', 'gas', 'gel', 'gua', 'hak', 'hal', 'hai', 'hiu', 'iga',
    'ibu', 'ini', 'itu', 'jas', 'jam', 'jua', 'juz', 'jin', 'alu', 'jok',
    'jus', 'kap', 'kas', 'kah', 'kol', 'kok', 'kos', 'kek', 'kue', 'kur',
    'lah', 'lap', 'las', 'lem', 'les', 'lor', 'luk', 'mah', 'mau', 'mak',
    'mas', 'mat', 'mie', 'mur', 'nol', 'nya', 'oli', 'ons', 'pos', 'pak',
    'pen', 'pas', 'per', 'pes', 'pir', 'pon', 'pun', 'rak', 'ram', 'ras',
    'rel', 'rem', 'rim', 'rok', 'rit', 'roh', 'ruh', 'ria', 'rua', 'sah', 'sak',
    'sal', 'sap', 'sel', 'sen', 'sok', 'sup', 'sih', 'tam', 'teh', 'tik',
    'tim', 'tol', 'top', 'tua', 'tuk', 'ubi', 'uji', 'vas', 'wah', 'zat',
  ],
  medium: [
    'abjad', 'absen', 'acung', 'acuan', 'adegan', 'agama', 'ahli', 'hari',
    'ajaib', 'akrab', 'akbar', 'alami', 'ampuh', 'asing', 'ambil',
    'ancam', 'andal', 'angka', 'angin', 'antar', 'apung', 'aneka',
    'arwah', 'bakti', 'awasi', 'bakat', 'bakar', 'bambu', 'bantu',
    'baris', 'batas', 'batin', 'bayar', 'bedah', 'bekal', 'belah',
    'benar', 'berita', 'bijak', 'bilas', 'bisik', 'buang', 'buaya',
    'budak', 'bukit', 'bulat', 'bumbu', 'bunga', 'buruk', 'cabai',
    'cacat', 'cedok', 'cagar', 'calon', 'camat', 'catat', 'cekik',
    'celah', 'cepat', 'cipta', 'corak', 'cuaca', 'cubit', 'cocok',
    'curah', 'dahan', 'damai', 'debat', 'dekat', 'delta', 'demam',
    'derap', 'desas', 'dewan', 'didik', 'dinas', 'domba', 'dunia',
    'dusun', 'eksak', 'ember', 'emosi', 'empat', 'endap', 'emas',
    'elang', 'fajar', 'fatal', 'fauna', 'serat', 'sosok', 'akhir',
    'pohon', 'pusat', 'sekat', 'purba', 'gagas', 'galak', 'garuk',
    'gelar', 'gempa', 'genap', 'gerak', 'gigit', 'gosip', 'ampun',
    'habis', 'halal', 'harap', 'harga', 'hebat', 'hemat', 'hibah',
    'hijau', 'hilir', 'hutan', 'ideal', 'iklan', 'ilham', 'imaji',
    'indah', 'masuk', 'jahat', 'jarak', 'jatuh', 'jelas', 'jenis',
    'jeruk', 'jihad', 'jilid', 'juluk', 'jurus', 'kabar', 'kawat',
    'kacau', 'kadar', 'kadal', 'kalah', 'kamar', 'kasur', 'kecil',
    'kejar', 'keras', 'kilat', 'tagih', 'kobar', 'kopra', 'krisis',
    'kubis', 'kulit', 'kumis', 'kursi', 'lahan', 'lapar', 'layak',
    'lebah', 'lemah', 'licik', 'ujung', 'logam', 'lokal', 'lomba',
    'lunak', 'lunas', 'mahal', 'mahir', 'makan', 'makin', 'malah',
    'mandi', 'marak', 'marga', 'merah', 'milik', 'mimpi', 'mirip',
    'rudal', 'mobil', 'ragam', 'mogok', 'watak', 'karsa', 'mulia',
    'mulut', 'mulus', 'lukis', 'murni', 'nakal', 'napas', 'nasib',
    'nekat', 'nikah', 'nomor', 'norma', 'nanas', 'nyala', 'danau',
    'obral', 'tubuh', 'paham', 'paksa', 'panas', 'bilah', 'papan',
    'pasar', 'pecah', 'pedas', 'peluk', 'perak', 'pergi', 'pesan',
    'petak', 'pilar', 'polah', 'sehat', 'prosa', 'puasa', 'pucat',
    'lacak', 'rajin', 'rapat', 'redam', 'renang', 'resah', 'resmi',
    'robek', 'rahim', 'rubah', 'ruang', 'sabuk', 'nalar', 'sakit',
    'pundi', 'salut', 'samar', 'saraf', 'sebab', 'semak', 'sibuk',
    'siram', 'sisir', 'surya', 'sulit', 'sulur', 'surat', 'tabir',
    'tajam', 'taman', 'tanah', 'tapak', 'tekad', 'telur', 'tenar',
    'terka', 'tidak', 'tanda', 'timah', 'tinta', 'tokoh', 'topan',
    'tujuh', 'bisul', 'tunas', 'tusuk', 'udara', 'ukiran', 'ulang',
    'ulama', 'utama', 'tukar', 'kuman', 'suara', 'wajah', 'warna',
    'wasit', 'yakni', 'yakin', 'iuran', 'zakar', 'zaman', 'satwa',
  ],
  hard: [
    'mutlak', 'ginjal', 'tangkas', 'kerani', 'alamiah', 'biduran',
    'amanat', 'anggrek', 'ganjil', 'ramuan', 'perajin', 'idaman',
    'kapang', 'bandara', 'barokah', 'berlian', 'bijaksana', 'bintang',
    'bongkar', 'tanaman', 'budiman', 'cakrawala', 'catatan', 'cendana',
    'centang', 'cerdas', 'ciptaan', 'dampak', 'daratan', 'peminjam',
    'batasan', 'pelapukan', 'dermaga', 'dewata', 'wangsa', 'ijazah',
    'tertib', 'senyap', 'semesta', 'dagang', 'galian', 'listrik',
    'bukti', 'setempat', 'wabah', 'pajangan', 'jelmaan', 'pedoman',
    'khayalan', 'gejala', 'serabut', 'rumusan', 'gemintang', 'benteng',
    'gelagar', 'keturunan', 'kebumian', 'gerakan', 'ukuran', 'tingkatan',
    'hunian', 'marmut', 'serasi', 'kedap', 'silangan', 'sejarah',
    'getah', 'ibadah', 'haluan', 'impian', 'susuk', 'lumpuh',
    'temuan', 'pemasangan', 'sungsang', 'setara', 'jagat', 'jaminan',
    'jangkar', 'jejaring', 'raksasa', 'kacamata', 'hitungan', 'peserta',
    'modal', 'daftar', 'pemicu', 'kelamin', 'kerajaan', 'kesturi',
    'khasiat', 'kiblat', 'puncak', 'kumpulan', 'rumit', 'mufakat',
    'perjanjian', 'hablur', 'bobot', 'petugas', 'aliran', 'samping',
    'lawatan', 'lembaga', 'bebas', 'pasokan', 'besaran', 'mandiri',
    'ikrar', 'bahan', 'penengah', 'piring', 'memandu', 'menghibur',
    'raksa', 'cairan', 'tambang', 'rahasia', 'bagian', 'pantau',
    'tugu', 'negara', 'kemudi', 'kurang', 'nilai', 'biasa',
    'inti', 'tambun', 'cangkok', 'tanding', 'tindakan', 'terbaik',
    'hayati', 'gamelan', 'wewenang', 'padanan', 'palagan', 'pameran',
    'panitia', 'janggal', 'zarah', 'pejuang', 'pendidik', 'burung',
    'purna', 'senyawa', 'perangi', 'limas', 'tembaga', 'siasat',
    'jinjing', 'unggul', 'masalah', 'buatan', 'jabatan', 'gencar',
    'sebar', 'gizi', 'daerah', 'remaja', 'pusaran', 'tuntas',
    'rapuhnya', 'wadah', 'balas', 'satuan', 'relawan', 'ulangan',
    'pemulihan', 'perubahan', 'mesra', 'kubah', 'ilmiah', 'santunan',
    'sindiran', 'iringan', 'saksama', 'semangat', 'gempar', 'tengah',
    'tiruan', 'naskah', 'kokoh', 'pantulan', 'tahap', 'sebutan',
    'rencana', 'hakikat', 'untung', 'bingkisan', 'koran', 'cerdik',
    'dering', 'contoh', 'dalil', 'terbang', 'pangkalan', 'terang',
    'megah', 'bentuk', 'budaya', 'piagam', 'pengadilan', 'gelombang',
    'baling', 'peringatan', 'unggulan', 'manfaat', 'penangkal', 'hantu',
    'tumbuhan', 'lubang', 'maya', 'sari', 'sukarela', 'warisan',
    'takut', 'hukum', 'hewan',
  ],
  expert: [
    'menyimpang', 'pengampunan', 'penyesuaian', 'pembelaan', 'hambatan',
    'pengakuan', 'langkah', 'simpangan', 'kiasan', 'anggapan',
    'benda', 'antariksa', 'persiapan', 'kiamat', 'bangunan',
    'angkasa', 'pembuktian', 'sendiri', 'kehidupan', 'darah',
    'campuran', 'caturwulan', 'putaran', 'maklumat', 'demografi',
    'wicara', 'matra', 'hubungan', 'wacana', 'pembagian',
    'jaringan', 'pelaksana', 'percobaan', 'pemerasan', 'persamaan',
    'kamus', 'penyakit', 'tangga', 'penilai', 'berangsur',
    'pembuatan', 'penyedia', 'mendalam', 'mendasar', 'canggih',
    'kewilayahan', 'sejagat', 'tarikan', 'penyelarasan', 'belahan',
    'dugaan', 'melintang', 'pengenal', 'keyakinan', 'akibat',
    'petunjuk', 'prasarana', 'prakarsa', 'pembaru', 'gairah',
    'kejujuran', 'gangguan', 'penafsiran', 'penyelidikan', 'tetap',
    'peradilan', 'penaksiran', 'pemodal', 'tegas', 'keabadian',
    'keberanian', 'kebijakan', 'kecerdasan', 'keharmonisan', 'keistimewaan',
    'kekuasaan', 'kelaziman', 'kemandirian', 'kemiskinan', 'kemuliaan',
    'kenikmatan', 'kepastian', 'kepemimpinan', 'keragamaan', 'kerjasama',
    'kesehatan', 'ketahanan', 'ketimpangan', 'keunggulan', 'kerumitan',
    'bincang', 'pertemuan', 'pelestarian', 'kekinian', 'sumbangan',
    'penataan', 'rekaan', 'kejahatan', 'sifat', 'jumlah',
    'bengkel', 'landasan', 'pengesahan', 'merdeka', 'pustaka',
    'magistrat', 'perwujudan', 'rekayasa', 'penyetaraan', 'susunan',
    'sandiwara', 'pencernaan', 'pengkajian', 'ketentaraan', 'pembaruan',
    'monumental', 'kebinekaan', 'musyawarah', 'nasionalisme', 'navigasi',
    'penawaran', 'nonfiksi', 'penormalan', 'adil', 'pengamatan',
    'pojokan', 'persaingan', 'peluang', 'titik', 'perserikatan',
    'pengenalan', 'ajaran', 'bentang', 'bertentangan', 'partisipasi',
    'patologis', 'pengembangan', 'peradaban', 'kinerja',
    'perimbangan', 'berkala', 'kekal', 'pandang', 'pertimbangan',
    'penjiplakan', 'kemajemukan', 'negarawan', 'kemampuan', 'lugas',
    'pilihan', 'kemungkinan', 'terlatih', 'pesat', 'hasutan',
    'runtut', 'kebatinan', 'penyiaran', 'pemotretan', 'perbaikan',
    'nisbi', 'martabat', 'pemulihan', 'perombak', 'arti',
    'pemusatan', 'penting', 'peduli', 'keteraturan', 'pergaulan',
    'menakjubkan', 'mandek', 'pembakuan', 'data', 'kerangka',
    'berarti', 'kejayaan', 'penghubung', 'sementara', 'menyatu',
    'istilah', 'kedaerahan', 'kuno', 'peralihan', 'bening',
    'peringatan', 'perguruan', 'perpindahan', 'kegunaan', 'kesahihan',
    'pemeriksaan', 'pakar', 'penggambaran', 'pegunungan', 'kehakiman',
  ],
};

// ─── LANGUAGE-AWARE WORD BANK GETTER ─────────────────────────
function getWordBanks(lang) {
  return lang === 'id' ? WORD_BANKS_ID : WORD_BANKS_EN;
}

const UI_TEXT = {
  en: {
    score: 'SCORE',
    speed: 'SPEED',
    lvl: 'LVL',
    titleLine1: 'TYPING SPACE',
    titleLine2: 'SHOOTER',
    instruction1: 'Type the words above enemies to destroy them',
    instruction2: 'Collect Lucky Boxes for buffs & Hearts for HP',
    pressStart: '[ PRESS ENTER TO START ]',
    version: 'v1.1 — ENDLESS MODE',
    gameOver: 'GAME OVER',
    finalScore: 'FINAL SCORE',
    maxSpeed: 'MAX SPEED',
    level: 'LEVEL',
    pressRestart: '[ PRESS ENTER TO RESTART ]',
    hp: 'HP',
    buffSlowmo: 'SLOW MOTION',
    buffDouble: 'DOUBLE SCORE',
    buffBomb: 'BOMB!',
    buffShield: 'SHIELD',
    buffLaser: 'AUTO LASER',
    paused: 'GAME PAUSED',
    settings: 'SETTINGS',
    language: 'LANGUAGE',
    refreshRate: 'REFRESH RATE',
    unlimited: 'UNLIMITED',
    pressEscResume: '[ PRESS ESC/ENTER TO RESUME ]',
    typeHere: '[ TYPE WORD HERE ]',
    resume: 'RESUME',
  },
  id: {
    score: 'SCORE',
    speed: 'SPEED',
    lvl: 'LVL',
    titleLine1: 'MENGETIK LUAR',
    titleLine2: 'ANGKASA',
    instruction1: 'Ketik kata di atas musuh untuk menghancurkannya',
    instruction2: 'Kumpulkan Kotak Buff & Hati untuk HP',
    pressStart: '[ TEKAN ENTER UNTUK MULAI ]',
    version: 'v1.1 — MODE TAK TERBATAS',
    gameOver: 'PERMAINAN BERAKHIR',
    finalScore: 'SKOR AKHIR',
    maxSpeed: 'KECEPATAN MAKS',
    level: 'LEVEL',
    pressRestart: '[ TEKAN ENTER UNTUK ULANG ]',
    hp: 'HP',
    buffSlowmo: 'GERAK LAMBAT',
    buffDouble: 'SKOR GANDA',
    buffBomb: 'BOM!',
    buffShield: 'PERISAI',
    buffLaser: 'LASER OTOMATIS',
    paused: 'PERMAINAN DIJEDA',
    settings: 'PENGATURAN',
    language: 'BAHASA',
    refreshRate: 'REFRESH RATE',
    unlimited: 'UNLIMITED',
    pressEscResume: '[ TEKAN ESC/ENTER UNTUK LANJUT ]',
    typeHere: '[ KETIK KATA DI SINI ]',
    resume: 'LANJUTKAN',
  },
};

// ─── GAME CONFIGURATION ─────────────────────────────────────
const CONFIG = {
  PLAYER_DEFAULT_HEARTS: 3,
  PLAYER_MAX_HEARTS: 5,
  BASE_FALL_SPEED: 70,           // pixels per second
  BULLET_SPEED: 1100,            // pixels per second
  BASE_ALIEN_SPAWN_MS: 2800,     // milliseconds
  LUCKY_BOX_SPAWN_MS: 12000,
  HEART_SPAWN_MS: 18000,
  BUFF_DURATION_MS: 10000,
  SPEED_UP_INTERVAL: 75,         // every N points
  SPEED_UP_FACTOR: 1.08,         // multiplier per level
  SCORE_PER_ALIEN: 10,
  ENTITY_SIZE: 42,
  PLAYER_SIZE: 52,
  MAX_PARTICLES: 200,
  STAR_COUNT: 120,
};

// ─── BUFF DEFINITIONS ────────────────────────────────────────
// Names are resolved at runtime from UI_TEXT based on current language
const BUFF_TYPES = [
  { id: 'slowmo', nameKey: 'buffSlowmo', color: '#00bfff' },
  { id: 'double', nameKey: 'buffDouble', color: '#ffd700' },
  { id: 'bomb', nameKey: 'buffBomb', color: '#ff4400', instant: true },
  { id: 'shield', nameKey: 'buffShield', color: '#00ff88', instant: true },
  { id: 'laser', nameKey: 'buffLaser', color: '#cc44ff' },
];

// ─── CANVAS SETUP ────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ─── UTILITY FUNCTIONS ──────────────────────────────────────
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min, max) { return Math.random() * (max - min) + min; }
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function dist(x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); }

/** Draw a heart shape centered at (cx, cy) */
function drawHeartShape(cx, cy, size) {
  const w = size, h = size;
  ctx.beginPath();
  ctx.moveTo(cx, cy - h * 0.15);
  ctx.bezierCurveTo(cx, cy - h * 0.55, cx - w * 0.55, cy - h * 0.55, cx - w * 0.55, cy - h * 0.15);
  ctx.bezierCurveTo(cx - w * 0.55, cy + h * 0.15, cx, cy + h * 0.35, cx, cy + h * 0.55);
  ctx.bezierCurveTo(cx, cy + h * 0.35, cx + w * 0.55, cy + h * 0.15, cx + w * 0.55, cy - h * 0.15);
  ctx.bezierCurveTo(cx + w * 0.55, cy - h * 0.55, cx, cy - h * 0.55, cx, cy - h * 0.15);
  ctx.closePath();
}

// ─── STAR (BACKGROUND PARALLAX) ─────────────────────────────
class Star {
  constructor() { this.reset(true); }
  reset(randomY = false) {
    this.x = Math.random() * canvas.width;
    this.y = randomY ? Math.random() * canvas.height : -2;
    this.size = randFloat(0.5, 2.5);
    this.speed = this.size * 18 + 8; // bigger = faster
    this.opacity = randFloat(0.3, 0.9);
    this.twinkleSpeed = randFloat(1.5, 4);
    this.twinklePhase = Math.random() * Math.PI * 2;
  }
  update(dt) {
    this.y += this.speed * dt;
    this.twinklePhase += this.twinkleSpeed * dt;
    if (this.y > canvas.height + 5) this.reset(false);
  }
  render(time) {
    const alpha = this.opacity * (0.6 + 0.4 * Math.sin(this.twinklePhase));
    ctx.fillStyle = `rgba(200, 220, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ─── PARTICLE (EXPLOSION EFFECTS) ──────────────────────────
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 300;
    this.vy = (Math.random() - 0.5) * 300;
    this.life = 1.0;
    this.decay = randFloat(0.8, 2.5);
    this.color = color;
    this.size = randFloat(1.5, 5);
  }
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= (1 - 1.5 * dt); // drag
    this.vy *= (1 - 1.5 * dt);
    this.life -= this.decay * dt;
  }
  render() {
    if (this.life <= 0) return;
    ctx.globalAlpha = this.life;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

// ─── ENTITY (Alien, Lucky Box, Heart) ────────────────────────
class Entity {
  constructor(type, x, word) {
    this.type = type;         // 'alien' | 'luckybox' | 'heart'
    this.x = x;
    this.y = -50;
    this.word = word.toUpperCase();
    this.typedIndex = 0;      // how many letters typed
    this.isTargeted = false;
    this.alive = true;
    this.spawnTime = performance.now();
    this.size = CONFIG.ENTITY_SIZE;
    // Pulsing animation phase
    this.pulsePhase = Math.random() * Math.PI * 2;
  }
  /** Get center X/Y of this entity */
  get cx() { return this.x; }
  get cy() { return this.y; }
}

// ─── BULLET (Laser projectile) ──────────────────────────────
class Bullet {
  constructor(startX, startY, target) {
    this.x = startX;
    this.y = startY;
    this.target = target;
    this.speed = CONFIG.BULLET_SPEED;
    this.alive = true;
    this.trail = []; // stores past positions for trail effect
  }
  update(dt) {
    // Store trail point
    this.trail.push({ x: this.x, y: this.y, life: 1 });
    if (this.trail.length > 12) this.trail.shift();

    // Move toward target entity
    const tx = this.target.cx;
    const ty = this.target.cy;
    const dx = tx - this.x;
    const dy = ty - this.y;
    const d = Math.hypot(dx, dy);

    if (d < 18) return true; // HIT

    const move = this.speed * dt;
    this.x += (dx / d) * move;
    this.y += (dy / d) * move;

    // Decay trail
    for (const t of this.trail) t.life -= 3 * dt;

    return false;
  }
  render() {
    // Draw trail
    for (const t of this.trail) {
      if (t.life <= 0) continue;
      ctx.globalAlpha = t.life * 0.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0ff';
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(t.x, t.y);
      ctx.lineTo(t.x, t.y + 8);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // Draw bullet head
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#0ff';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - 8);
    ctx.lineTo(this.x, this.y + 8);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

// =============================================================
//  MAIN GAME CLASS
// =============================================================
class Game {
  constructor() {
    // ── State ──
    this.state = 'menu'; // 'menu' | 'playing' | 'gameover' | 'paused'

    // ── Pause Menu Navigation ──
    this.pauseMenuSelectedRow = 0; // 0: Language, 1: Refresh Rate, 2: Resume

    // ── Language (default English) ──
    this.language = 'en';

    // ── Core collections ──
    this.entities = [];
    this.bullets = [];
    this.particles = [];
    this.stars = [];

    // ── Player ──
    this.playerX = 0;
    this.playerY = 0;
    this.hearts = CONFIG.PLAYER_DEFAULT_HEARTS;

    // ── Typing ──
    this.currentTarget = null;

    // ── Score & Progression ──
    this.score = 0;
    this.gameSpeed = 1.0;
    this.speedLevel = 1;
    this.lastSpeedUpScore = 0;

    // ── High Score ──
    const savedHighScore = localStorage.getItem('typing_space_shooter_highscore');
    this.highScore = savedHighScore ? parseInt(savedHighScore, 10) : 0;

    // ── Buff ──
    this.activeBuff = null; // { id, name, color, timer }

    // ── Shield (passive, not timed) ──
    this.hasShield = false;
    this.shieldFlashTimer = 0;

    // ── Spawning timers (accumulated ms) ──
    this.alienSpawnTimer = 0;
    this.luckySpawnTimer = 0;
    this.heartSpawnTimer = 0;

    // ── FPS tracking ──
    this.targetFPS = 60;
    this.currentFPS = 0;
    this.fpsFrameCount = 0;
    this.fpsAccumulator = 0;
    this.fpsLimiterAccumulator = 0;
    this.lastFPSCalculationTime = 0;

    // ── Delta time ──
    this.lastTimestamp = 0;

    // ── Screen shake ──
    this.shakeIntensity = 0;
    this.shakeX = 0;
    this.shakeY = 0;

    // ── Flash overlay ──
    this.flashAlpha = 0;
    this.flashColor = '#ff0000';

    // ── Game time (for animations) ──
    this.gameTime = 0;

    // ── Init stars ──
    for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
      this.stars.push(new Star());
    }

    // ── Scanline offset (cosmetic) ──
    this.scanlineOffset = 0;
  }

  // ── RESET / START ──────────────────────────────────────────
  reset() {
    this.entities = [];
    this.bullets = [];
    this.particles = [];
    this.currentTarget = null;
    this.score = 0;
    this.gameSpeed = 1.0;
    this.speedLevel = 1;
    this.lastSpeedUpScore = 0;
    this.hearts = CONFIG.PLAYER_DEFAULT_HEARTS;
    this.activeBuff = null;
    this.hasShield = false;
    this.shieldFlashTimer = 0;
    this.alienSpawnTimer = 0;
    this.luckySpawnTimer = 0;
    this.heartSpawnTimer = 0;
    this.shakeIntensity = 0;
    this.flashAlpha = 0;
    this.gameTime = 0;
    this.playerX = canvas.width / 2;
    this.playerY = canvas.height - 135;
    this.pauseMenuSelectedRow = 0;
    this.fpsLimiterAccumulator = 0;
    this.lastFPSCalculationTime = 0;
    this.state = 'playing';
  }

  // ── WORD SELECTION ─────────────────────────────────────────
  getDifficultyTier() {
    if (this.score < 100) return 'easy';
    if (this.score < 250) return 'medium';
    if (this.score < 500) return 'hard';
    return 'expert';
  }

  /** Get a word, optionally one tier harder for special items.
   *  Uses the word bank matching the current language. */
  getWord(isSpecial = false) {
    let tier = this.getDifficultyTier();
    if (isSpecial) {
      const order = ['easy', 'medium', 'hard', 'expert'];
      const idx = order.indexOf(tier);
      tier = order[Math.min(idx + 1, order.length - 1)];
    }
    const banks = getWordBanks(this.language);
    const pool = banks[tier];
    // Avoid duplicates with currently active entities
    const activeWords = new Set(this.entities.map(e => e.word));
    const activeFirstLetters = new Set(this.entities.map(e => e.word[0]));

    // Prefer words with unique first letters
    let candidates = pool.filter(w => !activeWords.has(w.toUpperCase()) && !activeFirstLetters.has(w[0].toUpperCase()));
    if (candidates.length === 0) {
      candidates = pool.filter(w => !activeWords.has(w.toUpperCase()));
    }
    if (candidates.length === 0) candidates = pool;

    return candidates[randInt(0, candidates.length - 1)];
  }

  // ── SPAWNING ───────────────────────────────────────────────
  spawnEntity(type) {
    const isSpecial = (type !== 'alien');
    const word = this.getWord(isSpecial);
    const padding = 60;
    const x = randInt(padding, canvas.width - padding);
    const entity = new Entity(type, x, word);
    this.entities.push(entity);
  }

  // ── EXPLOSION PARTICLES ────────────────────────────────────
  explode(x, y, type) {
    const colors = {
      alien: ['#ff3333', '#ff6600', '#ff9900', '#ffffff'],
      luckybox: ['#ffd700', '#ffaa00', '#fff5a0', '#ffffff'],
      heart: ['#ff69b4', '#ff1493', '#ffb6c1', '#ffffff'],
    };
    const palette = colors[type] || colors.alien;
    const count = randInt(18, 30);
    for (let i = 0; i < count && this.particles.length < CONFIG.MAX_PARTICLES; i++) {
      this.particles.push(new Particle(x, y, palette[randInt(0, palette.length - 1)]));
    }
  }

  setLanguage(lang) {
    this.language = lang;

    // Clear existing entities so new ones spawn in the correct language
    if (this.currentTarget) {
      this.currentTarget.isTargeted = false;
      this.currentTarget = null;
    }
    this.entities = [];
    this.alienSpawnTimer = 0;
    this.luckySpawnTimer = 0;
    this.heartSpawnTimer = 0;
  }

  setFPS(fps) {
    this.targetFPS = fps;
    // Reset timing to avoid big dt jump
    this.lastTimestamp = 0;
  }

  // ── INPUT HANDLING ─────────────────────────────────────────
  handleKeyDown(e) {
    // ESC toggles play/pause state
    if (e.key === 'Escape') {
      if (this.state === 'playing') {
        this.state = 'paused';
        this.pauseMenuSelectedRow = 0;
      } else if (this.state === 'paused') {
        this.state = 'playing';
      }
      return;
    }

    // Menu / Game Over: ENTER to start/restart
    if (this.state === 'menu' || this.state === 'gameover') {
      if (e.key === 'Enter') {
        this.reset();
      }
      return;
    }

    // Paused state menu navigation
    if (this.state === 'paused') {
      if (e.key === 'ArrowUp') {
        this.pauseMenuSelectedRow = (this.pauseMenuSelectedRow - 1 + 3) % 3;
      } else if (e.key === 'ArrowDown') {
        this.pauseMenuSelectedRow = (this.pauseMenuSelectedRow + 1) % 3;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        if (this.pauseMenuSelectedRow === 0) {
          // Toggle language
          const newLang = this.language === 'en' ? 'id' : 'en';
          this.setLanguage(newLang);
        } else if (this.pauseMenuSelectedRow === 1) {
          // Cycle FPS
          const fpsOptions = [60, 120, 144, 0];
          let idx = fpsOptions.indexOf(this.targetFPS);
          if (idx === -1) idx = 0; // default 60
          if (e.key === 'ArrowLeft') {
            idx = (idx - 1 + fpsOptions.length) % fpsOptions.length;
          } else {
            idx = (idx + 1) % fpsOptions.length;
          }
          this.setFPS(fpsOptions[idx]);
        }
      } else if (e.key === 'Enter') {
        if (this.pauseMenuSelectedRow === 2) {
          this.state = 'playing';
        }
      }
      return;
    }

    if (this.state !== 'playing') return;

    if (e.key === 'Backspace') {
      if (this.currentTarget) {
        this.currentTarget.isTargeted = false;
        this.currentTarget.typedIndex = 0;
        this.currentTarget = null;
      }
      return;
    }

    const key = e.key.toUpperCase();
    // Only accept single alphabetic characters
    if (key.length !== 1 || key < 'A' || key > 'Z') return;

    const hasLaser = this.activeBuff && this.activeBuff.id === 'laser';

    // ── If we have a locked target, continue typing that word ──
    if (this.currentTarget) {
      const nextChar = this.currentTarget.word[this.currentTarget.typedIndex];
      if (key === nextChar) {
        this.currentTarget.typedIndex++;
        AudioFX.playTyping();

        // Laser buff: auto-complete the rest of the word
        if (hasLaser) {
          this.currentTarget.typedIndex = this.currentTarget.word.length;
        }

        // Word fully typed → fire laser!
        if (this.currentTarget.typedIndex >= this.currentTarget.word.length) {
          this.fireBullet(this.currentTarget);
          this.currentTarget.isTargeted = false;
          this.currentTarget = null;
        }
      }
      // Wrong key while locked: simply ignore (forgiving)
      return;
    }

    // ── No target locked: find best matching entity ──
    // Filter entities whose next untyped letter matches the key
    const matches = this.entities.filter(e =>
      e.alive && e.typedIndex === 0 && e.word[0] === key
    );
    if (matches.length === 0) return;

    // Pick the one closest to the bottom (most urgent)
    matches.sort((a, b) => b.y - a.y);
    const target = matches[0];
    target.isTargeted = true;
    target.typedIndex = 1;
    this.currentTarget = target;
    AudioFX.playTyping();

    // Laser buff: auto-complete the rest of the word on first letter
    if (hasLaser) {
      target.typedIndex = target.word.length;
    }

    // Word fully typed → fire laser!
    if (target.typedIndex >= target.word.length) {
      this.fireBullet(target);
      target.isTargeted = false;
      this.currentTarget = null;
    }
  }

  fireBullet(target) {
    this.bullets.push(new Bullet(this.playerX, this.playerY - CONFIG.PLAYER_SIZE / 2, target));
    AudioFX.playLaser();
  }

  // ── HANDLE ENTITY HIT (bullet reached target) ─────────────
  handleHit(entity) {
    // Guard: prevent double-processing if bullet hits entity already dead
    if (!entity.alive) return;
    entity.alive = false;
    this.explode(entity.cx, entity.cy, entity.type);

    if (entity.type === 'alien') {
      let pts = CONFIG.SCORE_PER_ALIEN;
      if (this.activeBuff && this.activeBuff.id === 'double') pts *= 2;
      this.score += pts;
      AudioFX.playExplosion();
    }
    else if (entity.type === 'luckybox') {
      // Grant a random buff, resolve name from current language
      const buffDef = BUFF_TYPES[randInt(0, BUFF_TYPES.length - 1)];
      const t = UI_TEXT[this.language];

      if (buffDef.id === 'bomb') {
        // ── BOMB: Instantly destroy all aliens on screen ──
        for (let i = this.entities.length - 1; i >= 0; i--) {
          const ent = this.entities[i];
          if (ent.alive && ent.type === 'alien') {
            ent.alive = false;
            this.explode(ent.cx, ent.cy, 'alien');
            let pts = CONFIG.SCORE_PER_ALIEN;
            if (this.activeBuff && this.activeBuff.id === 'double') pts *= 2;
            this.score += pts;
            if (ent === this.currentTarget) this.currentTarget = null;
          }
        }
        AudioFX.playExplosion();
        this.shakeIntensity = 22;
        this.flashColor = '#ff4400';
        this.flashAlpha = 0.45;
      }
      else if (buffDef.id === 'shield') {
        // ── SHIELD: Passive protection, lasts until used ──
        if (this.hasShield) {
          // If already has shield, convert to points (10 pts, affected by double score)
          let pts = 10;
          if (this.activeBuff && this.activeBuff.id === 'double') pts *= 2;
          this.score += pts;
          AudioFX.playBuff();
          this.flashColor = '#ffd700'; // Gold flash for points
          this.flashAlpha = 0.3;
        } else {
          this.hasShield = true;
          AudioFX.playBuff();
          this.flashColor = '#00ff88';
          this.flashAlpha = 0.3;
        }
      }
      else {
        // ── Timed buffs (slowmo, double, laser) ──
        this.activeBuff = {
          id: buffDef.id,
          name: t[buffDef.nameKey],
          color: buffDef.color,
          timer: CONFIG.BUFF_DURATION_MS / 1000,
        };
        AudioFX.playBuff();
        this.flashColor = buffDef.color;
        this.flashAlpha = 0.25;
      }
    }
    else if (entity.type === 'heart') {
      if (this.hearts < CONFIG.PLAYER_MAX_HEARTS) {
        this.hearts++;
        AudioFX.playHeal();
        this.flashColor = '#ff69b4';
        this.flashAlpha = 0.2;
      } else {
        // HP full, convert to points (10 pts, affected by double score)
        let pts = 10;
        if (this.activeBuff && this.activeBuff.id === 'double') pts *= 2;
        this.score += pts;
        AudioFX.playHeal();
        this.flashColor = '#ffd700'; // Gold flash for points
        this.flashAlpha = 0.3;
      }
    }

    // Check speed progression
    this.checkSpeedUp();
  }

  // ── SPEED PROGRESSION ──────────────────────────────────────
  checkSpeedUp() {
    const interval = CONFIG.SPEED_UP_INTERVAL;
    while (this.score >= this.lastSpeedUpScore + interval) {
      this.lastSpeedUpScore += interval;
      this.gameSpeed = Math.min(this.gameSpeed * CONFIG.SPEED_UP_FACTOR, 2.0);
      this.speedLevel++;
    }
  }

  // ── ALIEN REACHES BOTTOM → LOSE HEART ─────────────────────
  loseHeart() {
    // ── Shield absorption: block the hit ──
    if (this.hasShield) {
      this.hasShield = false;
      this.shieldFlashTimer = 1.0;
      this.shakeIntensity = 8;
      this.flashColor = '#00ff88';
      this.flashAlpha = 0.3;
      AudioFX.playBuff();
      return; // No heart lost!
    }

    this.hearts--;
    this.shakeIntensity = 14;
    this.flashColor = '#ff0000';
    this.flashAlpha = 0.35;
    AudioFX.playHit();

    if (this.hearts <= 0) {
      this.state = 'gameover';
      AudioFX.playGameOver();
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('typing_space_shooter_highscore', this.highScore);
      }
    }
  }

  // ── MAIN UPDATE (dt in seconds) ────────────────────────────
  update(dt) {
    this.gameTime += dt;

    // ── Update player position (tracks canvas center) ──
    this.playerX = canvas.width / 2;
    this.playerY = canvas.height - 135;

    // ── Screen shake decay ──
    if (this.shakeIntensity > 0) {
      this.shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity *= Math.pow(0.05, dt); // rapid decay
      if (this.shakeIntensity < 0.3) { this.shakeIntensity = 0; this.shakeX = 0; this.shakeY = 0; }
    }

    // ── Flash overlay decay ──
    if (this.flashAlpha > 0) {
      this.flashAlpha -= dt * 1.2;
      if (this.flashAlpha < 0) this.flashAlpha = 0;
    }

    // ── Buff timer ──
    if (this.activeBuff) {
      this.activeBuff.timer -= dt;
      if (this.activeBuff.timer <= 0) this.activeBuff = null;
    }

    // ── Shield flash decay ──
    if (this.shieldFlashTimer > 0) {
      this.shieldFlashTimer -= dt * 2;
      if (this.shieldFlashTimer < 0) this.shieldFlashTimer = 0;
    }

    // ── Spawning timers ──
    const dtMs = dt * 1000;
    this.alienSpawnTimer += dtMs;
    this.luckySpawnTimer += dtMs;
    this.heartSpawnTimer += dtMs;

    // Alien spawn (interval decreases with gameSpeed)
    const alienInterval = CONFIG.BASE_ALIEN_SPAWN_MS / this.gameSpeed;
    if (this.alienSpawnTimer >= alienInterval) {
      this.alienSpawnTimer -= alienInterval;
      this.spawnEntity('alien');
    }
    // Lucky Box spawn (fixed rate, not sped up)
    if (this.luckySpawnTimer >= CONFIG.LUCKY_BOX_SPAWN_MS) {
      this.luckySpawnTimer -= CONFIG.LUCKY_BOX_SPAWN_MS;
      this.spawnEntity('luckybox');
    }
    // Heart spawn (fixed rate)
    if (this.heartSpawnTimer >= CONFIG.HEART_SPAWN_MS) {
      this.heartSpawnTimer -= CONFIG.HEART_SPAWN_MS;
      this.spawnEntity('heart');
    }

    // ── Update entities ──
    const slowMultiplier = (this.activeBuff && this.activeBuff.id === 'slowmo') ? 0.4 : 1.0;
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const e = this.entities[i];
      if (!e.alive) {
        if (e === this.currentTarget) this.currentTarget = null;
        this.entities.splice(i, 1);
        continue;
      }

      // Fall speed (special items slightly slower)
      let speedMod = (e.type === 'alien') ? 1.0 : 0.7;
      e.y += CONFIG.BASE_FALL_SPEED * this.gameSpeed * speedMod * slowMultiplier * dt;

      // Pulse animation
      e.pulsePhase += 3 * dt;

      // Reached bottom?
      if (e.y > canvas.height + 20) {
        // Mark as dead so bullet won't double-process
        e.alive = false;
        // Release target lock if this was the current target
        if (e === this.currentTarget) { this.currentTarget = null; }

        if (e.type === 'alien') {
          this.loseHeart();
        }
        // Lucky Box & Heart just disappear – no penalty
        this.entities.splice(i, 1);
      }
    }

    // ── Update bullets ──
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      const hit = b.update(dt);
      if (hit) {
        this.handleHit(b.target);
        this.bullets.splice(i, 1);
      } else if (!b.target.alive) {
        // Target already dead (edge case)
        this.bullets.splice(i, 1);
      }
    }

    // ── Update particles ──
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(dt);
      if (this.particles[i].life <= 0) this.particles.splice(i, 1);
    }

    // ── Update stars ──
    for (const star of this.stars) star.update(dt);

    // ── Scanline cosmetic ──
    this.scanlineOffset = (this.scanlineOffset + 30 * dt) % 4;
  }

  // ── RENDER ─────────────────────────────────────────────────
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply screen shake
    ctx.save();
    ctx.translate(this.shakeX, this.shakeY);

    // Stars
    for (const star of this.stars) star.render(this.gameTime);

    // Subtle grid lines (cyberpunk vibe)
    this.renderGrid();

    if (this.state === 'playing' || this.state === 'gameover') {
      // Entities
      for (const e of this.entities) this.renderEntity(e);

      // Bullets
      for (const b of this.bullets) b.render();

      // Particles
      for (const p of this.particles) p.render();

      // Player
      this.renderPlayer();
    }

    ctx.restore(); // end screen shake

    // Scanlines overlay (very subtle)
    this.renderScanlines();

    // Flash overlay
    if (this.flashAlpha > 0) {
      ctx.fillStyle = this.flashColor;
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }

    // HUD (not affected by shake)
    if (this.state === 'playing' || this.state === 'gameover' || this.state === 'paused') {
      this.renderHUD();
    }

    // State overlays
    if (this.state === 'menu') this.renderMenu();
    if (this.state === 'gameover') this.renderGameOver();
    if (this.state === 'paused') this.renderPauseMenu();
  }

  // ── RENDER: Grid ───────────────────────────────────────────
  renderGrid() {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 80;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }

  // ── RENDER: Scanlines ──────────────────────────────────────
  renderScanlines() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    for (let y = this.scanlineOffset; y < canvas.height; y += 4) {
      ctx.fillRect(0, y, canvas.width, 2);
    }
  }

  // ── RENDER: Player Ship ────────────────────────────────────
  renderPlayer() {
    const px = this.playerX;
    const py = this.playerY;
    const s = CONFIG.PLAYER_SIZE;

    if (IMAGES.player) {
      ctx.drawImage(IMAGES.player, px - s / 2, py - s / 2, s, s);
      return;
    }

    // Fallback: Neon cyan triangle ship
    const pulse = 0.85 + 0.15 * Math.sin(this.gameTime * 4);

    // Engine glow
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#0ff';
    ctx.fillStyle = `rgba(0, 255, 255, ${0.2 * pulse})`;
    ctx.beginPath();
    ctx.moveTo(px - s * 0.25, py + s * 0.3);
    ctx.lineTo(px, py + s * 0.6);
    ctx.lineTo(px + s * 0.25, py + s * 0.3);
    ctx.closePath();
    ctx.fill();

    // Main body
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#0ff';
    ctx.strokeStyle = `rgba(0, 255, 255, ${pulse})`;
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(0, 30, 50, 0.8)';

    ctx.beginPath();
    ctx.moveTo(px, py - s * 0.5);           // top
    ctx.lineTo(px - s * 0.38, py + s * 0.3); // bottom left
    ctx.lineTo(px - s * 0.12, py + s * 0.2); // inner left
    ctx.lineTo(px, py + s * 0.35);            // bottom center
    ctx.lineTo(px + s * 0.12, py + s * 0.2); // inner right
    ctx.lineTo(px + s * 0.38, py + s * 0.3); // bottom right
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cockpit (small diamond)
    ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + 0.3 * pulse})`;
    ctx.beginPath();
    ctx.moveTo(px, py - s * 0.2);
    ctx.lineTo(px - s * 0.08, py);
    ctx.lineTo(px, py + s * 0.1);
    ctx.lineTo(px + s * 0.08, py);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;

    // ── Shield visual (pulsing ring around ship) ──
    if (this.hasShield) {
      const shieldPulse = 0.6 + 0.4 * Math.sin(this.gameTime * 3);
      const shieldRadius = s * 0.65;
      ctx.beginPath();
      ctx.arc(px, py, shieldRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.strokeStyle = `rgba(0, 255, 136, ${0.5 * shieldPulse})`;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#00ff88';
      ctx.stroke();
      // Inner fill glow
      ctx.fillStyle = `rgba(0, 255, 136, ${0.06 * shieldPulse})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // ── Shield break flash effect ──
    if (this.shieldFlashTimer > 0) {
      const t = this.shieldFlashTimer;
      const breakRadius = s * 0.65 + (1 - t) * 40;
      ctx.beginPath();
      ctx.arc(px, py, breakRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.strokeStyle = `rgba(0, 255, 136, ${t * 0.8})`;
      ctx.lineWidth = 3 * t;
      ctx.shadowBlur = 20 * t;
      ctx.shadowColor = '#00ff88';
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  // ── RENDER: Entity (Alien / LuckyBox / Heart) ──────────────
  renderEntity(e) {
    const s = e.size;
    const pulse = 0.8 + 0.2 * Math.sin(e.pulsePhase);
    const cx = e.cx;
    const cy = e.cy;

    // Targeting reticle if locked
    if (e.isTargeted) {
      this.renderTargetReticle(cx, cy, s);
    }

    if (e.type === 'alien') {
      if (IMAGES.alien) {
        ctx.drawImage(IMAGES.alien, cx - s / 2, cy - s / 2, s, s);
      } else {
        // Neon red hexagon alien
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#ff3333';
        ctx.strokeStyle = `rgba(255, 50, 50, ${pulse})`;
        ctx.fillStyle = 'rgba(80, 10, 10, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const hx = cx + (s * 0.45) * Math.cos(angle);
          const hy = cy + (s * 0.45) * Math.sin(angle);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Alien "eye"
        ctx.fillStyle = `rgba(255, 80, 80, ${pulse})`;
        ctx.beginPath();
        ctx.arc(cx, cy, s * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    else if (e.type === 'luckybox') {
      if (IMAGES.lucky) {
        ctx.drawImage(IMAGES.lucky, cx - s / 2, cy - s / 2, s, s);
      } else {
        // Neon gold rotating diamond/box
        const rotAngle = this.gameTime * 1.5;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotAngle);
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#ffd700';
        ctx.strokeStyle = `rgba(255, 215, 0, ${pulse})`;
        ctx.fillStyle = 'rgba(80, 60, 0, 0.6)';
        ctx.lineWidth = 2.5;
        const hs = s * 0.38;
        ctx.beginPath();
        ctx.moveTo(0, -hs);
        ctx.lineTo(hs, 0);
        ctx.lineTo(0, hs);
        ctx.lineTo(-hs, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner star
        ctx.strokeStyle = `rgba(255, 255, 150, ${0.5 * pulse})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -hs * 0.5); ctx.lineTo(0, hs * 0.5);
        ctx.moveTo(-hs * 0.5, 0); ctx.lineTo(hs * 0.5, 0);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.restore();
      }
    }
    else if (e.type === 'heart') {
      if (IMAGES.heart) {
        ctx.drawImage(IMAGES.heart, cx - s / 2, cy - s / 2, s, s);
      } else {
        // Neon pink heart
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#ff69b4';
        ctx.strokeStyle = `rgba(255, 105, 180, ${pulse})`;
        ctx.fillStyle = 'rgba(100, 20, 50, 0.6)';
        ctx.lineWidth = 2;
        drawHeartShape(cx, cy, s * 0.45);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // ── Word label above entity ──
    this.renderWordLabel(e);
  }

  // ── RENDER: Target Reticle ─────────────────────────────────
  renderTargetReticle(cx, cy, size) {
    const r = size * 0.7;
    const angle = this.gameTime * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#0ff';

    // Draw 4 corner brackets
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.rotate((Math.PI / 2) * i);
      ctx.beginPath();
      ctx.moveTo(r, r * 0.4);
      ctx.lineTo(r, r);
      ctx.lineTo(r * 0.4, r);
      ctx.stroke();
      ctx.restore();
    }

    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // ── RENDER: Word Label ─────────────────────────────────────
  renderWordLabel(e) {
    const word = e.word;
    const fontSize = 16;
    ctx.font = `bold ${fontSize}px 'Share Tech Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    const labelY = e.cy - e.size * 0.55 - 8;

    // Background pill for readability
    const textWidth = ctx.measureText(word).width;
    const pillPadX = 8, pillPadY = 4;
    const pillX = e.cx - textWidth / 2 - pillPadX;
    const pillY = labelY - fontSize - pillPadY;
    const pillW = textWidth + pillPadX * 2;
    const pillH = fontSize + pillPadY * 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 5);
    ctx.fill();

    // Always draw a visible border around the box
    const borderColors = {
      alien: 'rgba(255, 50, 50, 0.6)',
      luckybox: 'rgba(255, 215, 0, 0.6)',
      heart: 'rgba(255, 105, 180, 0.6)',
    };
    if (e.isTargeted) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#0ff';
    } else {
      ctx.strokeStyle = borderColors[e.type] || 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Render each letter
    const totalWidth = ctx.measureText(word).width;
    let startX = e.cx - totalWidth / 2;

    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      const charW = ctx.measureText(ch).width;

      if (i < e.typedIndex) {
        // Already typed → neon green
        ctx.fillStyle = '#39ff14';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#39ff14';
      } else {
        // Untyped → white
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 0;
      }
      ctx.textAlign = 'left';
      ctx.fillText(ch, startX, labelY);
      startX += charW;
    }
    ctx.shadowBlur = 0;
    ctx.textAlign = 'center';
  }

  // ── Helper: get translated string for current language ─────
  t(key) { return UI_TEXT[this.language][key] || UI_TEXT.en[key] || key; }

  // ── RENDER: HUD ────────────────────────────────────────────
  renderHUD() {
    const pad = 20;

    // ── Top-left: Score ──
    ctx.font = 'bold 22px "Orbitron", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#0ff';
    ctx.fillStyle = '#0ff';
    ctx.fillText(this.t('score'), pad, pad);
    ctx.font = 'bold 32px "Orbitron", monospace';
    ctx.fillText(`${this.score}`, pad, pad + 26);
    ctx.shadowBlur = 0;

    // ── Top-left below score: Speed level ──
    ctx.font = '14px "Share Tech Mono", monospace';
    ctx.fillStyle = '#888';
    ctx.fillText(`${this.t('speed')}: ${this.gameSpeed.toFixed(2)}x`, pad, pad + 64);
    ctx.fillText(`${this.t('lvl')}: ${this.speedLevel}`, pad, pad + 82);

    // ── Top-right: High Score & FPS ──
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 16px "Orbitron", monospace';
    ctx.fillStyle = '#ffd700';
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ffd700';
    ctx.fillText(`HI-SCORE: ${this.highScore}`, canvas.width - pad, pad);
    ctx.shadowBlur = 0;

    ctx.font = '13px "Share Tech Mono", monospace';
    ctx.fillStyle = this.currentFPS >= 50 ? '#39ff14' : this.currentFPS >= 25 ? '#ffd700' : '#ff3333';
    ctx.fillText(`${this.currentFPS} FPS`, canvas.width - pad, pad + 24);

    // ── Bottom-left: Hearts ──
    this.renderHearts();

    // ── Active Buff indicator ──
    let buffBarBottomY = pad + 10;
    if (this.activeBuff) {
      const bx = canvas.width / 2;
      const by = pad + 10;
      const buffText = `⚡ ${this.activeBuff.name} (${this.activeBuff.timer.toFixed(1)}s)`;
      ctx.font = 'bold 16px "Orbitron", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const bw = ctx.measureText(buffText).width + 32;
      const bh = 32;
      const boxX = bx - bw / 2;
      const boxY = by;

      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, bw, bh, 6);
      ctx.fill();

      // Border
      ctx.strokeStyle = this.activeBuff.color;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.activeBuff.color;
      ctx.stroke();

      // Text (vertically centered in box)
      ctx.fillStyle = this.activeBuff.color;
      ctx.fillText(buffText, bx, boxY + bh / 2);

      // Progress bar (at bottom of box)
      const progress = this.activeBuff.timer / (CONFIG.BUFF_DURATION_MS / 1000);
      ctx.fillStyle = this.activeBuff.color;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(boxX + 2, boxY + bh - 5, (bw - 4) * progress, 3);
      ctx.globalAlpha = 1;

      ctx.shadowBlur = 0;
      buffBarBottomY = by + bh + 6;
    }

    // ── Shield passive indicator ──
    if (this.hasShield) {
      const bx = canvas.width / 2;
      const by = buffBarBottomY;
      const shieldLabel = this.t('buffShield');
      const shieldText = `🛡 ${shieldLabel}`;
      ctx.font = 'bold 14px "Orbitron", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const sw = ctx.measureText(shieldText).width + 28;
      const sh = 28;
      const sBoxX = bx - sw / 2;
      const sBoxY = by;

      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.roundRect(sBoxX, sBoxY, sw, sh, 5);
      ctx.fill();

      // Border
      const shieldPulse = 0.6 + 0.4 * Math.sin(this.gameTime * 3);
      ctx.strokeStyle = `rgba(0, 255, 136, ${shieldPulse})`;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00ff88';
      ctx.stroke();

      // Text
      ctx.fillStyle = `rgba(0, 255, 136, ${0.7 + 0.3 * shieldPulse})`;
      ctx.fillText(shieldText, bx, sBoxY + sh / 2);
      ctx.shadowBlur = 0;
    }

    // ── Visual Typing Box ──
    this.renderTypingBox();
  }

  // ── RENDER: Hearts (bottom center) ─────────────────────────
  renderHearts() {
    const pad = 20;
    const heartSize = 10;
    const gap = 6;
    const startX = pad;
    const y = canvas.height - 20;

    ctx.font = '11px "Share Tech Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('HP', startX, y - heartSize - 2);

    for (let i = 0; i < CONFIG.PLAYER_MAX_HEARTS; i++) {
      const hx = startX + i * (heartSize * 2 + gap) + heartSize;
      const hy = y;

      if (i < this.hearts) {
        // Filled heart
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff1493';
        ctx.fillStyle = '#ff1493';
        ctx.strokeStyle = '#ff69b4';
      } else {
        // Empty heart
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(60, 20, 30, 0.6)';
        ctx.strokeStyle = 'rgba(255, 105, 180, 0.25)';
      }

      ctx.lineWidth = 1.5;
      drawHeartShape(hx, hy, heartSize);
      ctx.fill();
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }

  renderTypingBox() {
    const cx = canvas.width / 2;
    const w = 360;
    const h = 42;
    const bx = cx - w / 2;
    const by = canvas.height - 70;

    // 1. Draw dashboard box background
    ctx.fillStyle = 'rgba(10, 10, 25, 0.85)';
    ctx.beginPath();
    ctx.roundRect(bx, by, w, h, 6);
    ctx.fill();

    // 2. Draw border
    const hasTarget = !!this.currentTarget;
    if (hasTarget) {
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0ff';
    } else {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 0;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 3. Draw content
    ctx.textBaseline = 'middle';
    if (!hasTarget) {
      // Placeholder
      ctx.font = '13px "Orbitron", monospace';
      ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
      ctx.textAlign = 'center';
      ctx.fillText(this.t('typeHere'), cx, by + h / 2);
    } else {
      // Active typing target
      const word = this.currentTarget.word;
      ctx.font = 'bold 20px "Share Tech Mono", monospace';
      ctx.textAlign = 'center';

      const totalWidth = ctx.measureText(word).width;
      let startX = cx - totalWidth / 2;

      // Draw letters
      for (let i = 0; i < word.length; i++) {
        const ch = word[i];
        const charW = ctx.measureText(ch).width;

        ctx.textAlign = 'left';
        if (i < this.currentTarget.typedIndex) {
          // Typed -> neon green with glow
          ctx.fillStyle = '#39ff14';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#39ff14';
        } else {
          // Untyped -> white
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.shadowBlur = 0;
        }
        ctx.fillText(ch, startX, by + h / 2);
        startX += charW;
      }
      ctx.shadowBlur = 0;
    }
  }

  // ── RENDER: Menu Screen ────────────────────────────────────
  renderMenu() {
    // Dark overlay
    ctx.fillStyle = 'rgba(5, 5, 15, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Title (uses translated strings)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#0ff';
    ctx.fillStyle = '#0ff';
    ctx.font = 'bold 48px "Orbitron", sans-serif';
    ctx.fillText(this.t('titleLine1'), cx, cy - 90);
    ctx.font = 'bold 56px "Orbitron", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#ff3399';
    ctx.fillText(this.t('titleLine2'), cx, cy - 35);
    ctx.shadowBlur = 0;

    // Decorative line
    const lineW = 300;
    const grad = ctx.createLinearGradient(cx - lineW / 2, 0, cx + lineW / 2, 0);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.3, '#0ff');
    grad.addColorStop(0.7, '#ff3399');
    grad.addColorStop(1, 'transparent');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - lineW / 2, cy + 5);
    ctx.lineTo(cx + lineW / 2, cy + 5);
    ctx.stroke();

    // Instructions
    ctx.font = '15px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fillText(this.t('instruction1'), cx, cy + 50);
    ctx.fillText(this.t('instruction2'), cx, cy + 75);

    // Start prompt (pulsing)
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 400);
    ctx.font = 'bold 20px "Orbitron", sans-serif';
    ctx.fillStyle = `rgba(0, 255, 255, ${0.4 + 0.6 * pulse})`;
    ctx.shadowBlur = 12 * pulse;
    ctx.shadowColor = '#0ff';
    ctx.fillText(this.t('pressStart'), cx, cy + 130);
    ctx.shadowBlur = 0;

    // Version
    ctx.font = '11px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillText(this.t('version'), cx, canvas.height - 30);
  }

  // ── RENDER: Game Over Screen ───────────────────────────────
  renderGameOver() {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(5, 0, 10, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // GAME OVER text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#ff0044';
    ctx.fillStyle = '#ff0044';
    ctx.font = 'bold 60px "Orbitron", sans-serif';
    ctx.fillText(this.t('gameOver'), cx, cy - 70);
    ctx.shadowBlur = 0;

    // Score
    ctx.font = '18px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(this.t('finalScore'), cx, cy - 10);
    ctx.font = 'bold 48px "Orbitron", sans-serif';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffd700';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(`${this.score}`, cx, cy + 35);
    ctx.shadowBlur = 0;

    // Stats
    ctx.font = '14px "Share Tech Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText(`${this.t('maxSpeed')}: ${this.gameSpeed.toFixed(2)}x  ·  ${this.t('level')}: ${this.speedLevel}`, cx, cy + 80);

    // Restart prompt
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 400);
    ctx.font = 'bold 18px "Orbitron", sans-serif';
    ctx.fillStyle = `rgba(0, 255, 255, ${0.4 + 0.6 * pulse})`;
    ctx.shadowBlur = 10 * pulse;
    ctx.shadowColor = '#0ff';
    ctx.fillText(this.t('pressRestart'), cx, cy + 130);
    ctx.shadowBlur = 0;
  }

  renderPauseMenu() {
    // Transparent dark overlay
    ctx.fillStyle = 'rgba(5, 5, 15, 0.82)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const w = 520;
    const h = 380;
    const cardX = cx - w / 2;
    const cardY = cy - h / 2;

    // Card background
    ctx.fillStyle = 'rgba(10, 10, 30, 0.92)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, w, h, 12);
    ctx.fill();

    // Card border with neon cyan glow
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#0ff';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Title: GAME PAUSED
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 28px "Orbitron", sans-serif';
    ctx.fillStyle = '#0ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#0ff';
    ctx.fillText(this.t('paused'), cx, cardY + 50);
    ctx.shadowBlur = 0;

    // Divider Line
    const grad = ctx.createLinearGradient(cx - 150, 0, cx + 150, 0);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, '#ff3399');
    grad.addColorStop(1, 'transparent');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 150, cardY + 80);
    ctx.lineTo(cx + 150, cardY + 80);
    ctx.stroke();

    // ── Row 0: Language Selection ──
    const row0Focused = this.pauseMenuSelectedRow === 0;
    ctx.font = 'bold 13px "Orbitron", monospace';
    ctx.fillStyle = row0Focused ? '#ff3399' : '#888';
    if (row0Focused) {
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ff3399';
    }
    ctx.fillText(this.t('language'), cx, cardY + 115);
    ctx.shadowBlur = 0;

    // EN Button
    const enSelected = this.language === 'en';
    const enX = cx - 110;
    const enY = cardY + 130;
    ctx.beginPath();
    ctx.roundRect(enX, enY, 100, 30, 5);
    if (enSelected) {
      ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#0ff';
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = enSelected ? '#0ff' : '#fff';
    ctx.font = 'bold 12px "Orbitron", monospace';
    ctx.fillText('ENGLISH', cx - 60, cardY + 145);

    // ID Button
    const idSelected = this.language === 'id';
    const idX = cx + 10;
    const idY = cardY + 130;
    ctx.beginPath();
    ctx.roundRect(idX, idY, 100, 30, 5);
    if (idSelected) {
      ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#0ff';
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = idSelected ? '#0ff' : '#fff';
    ctx.fillText('INDONESIA', cx + 60, cardY + 145);

    // ── Row 1: Refresh Rate (FPS) Selection ──
    const row1Focused = this.pauseMenuSelectedRow === 1;
    ctx.font = 'bold 13px "Orbitron", monospace';
    ctx.fillStyle = row1Focused ? '#ff3399' : '#888';
    if (row1Focused) {
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ff3399';
    }
    ctx.fillText(this.t('refreshRate'), cx, cardY + 195);
    ctx.shadowBlur = 0;

    const fpsOptions = [60, 120, 144, 0];
    const fpsLabels = ['60', '120', '144', this.t('unlimited')];
    const btnW = 80;
    const btnH = 30;
    const gap = 14;
    const totalW = fpsOptions.length * btnW + (fpsOptions.length - 1) * gap;
    const startX = cx - totalW / 2;
    const fpsY = cardY + 210;

    for (let i = 0; i < fpsOptions.length; i++) {
      const opt = fpsOptions[i];
      const lbl = fpsLabels[i];
      const selected = this.targetFPS === opt;
      const x = startX + i * (btnW + gap);

      ctx.beginPath();
      ctx.roundRect(x, fpsY, btnW, btnH, 5);
      if (selected) {
        ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#0ff';
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = selected ? '#0ff' : '#fff';
      ctx.font = 'bold 11px "Orbitron", monospace';
      ctx.fillText(lbl, x + btnW / 2, fpsY + btnH / 2);
    }

    // ── Row 2: Resume Button ──
    const row2Focused = this.pauseMenuSelectedRow === 2;
    const resX = cx - 100;
    const resY = cardY + 280;
    const resW = 200;
    const resH = 40;

    ctx.beginPath();
    ctx.roundRect(resX, resY, resW, resH, 6);
    if (row2Focused) {
      const pulse = 0.8 + 0.2 * Math.sin(performance.now() / 200);
      ctx.fillStyle = `rgba(255, 51, 153, ${0.15 * pulse})`;
      ctx.fill();
      ctx.strokeStyle = '#ff3399';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 12 * pulse;
      ctx.shadowColor = '#ff3399';
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1.5;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.font = 'bold 15px "Orbitron", sans-serif';
    ctx.fillStyle = row2Focused ? '#ff3399' : '#fff';
    ctx.fillText(this.t('resume'), cx, resY + resH / 2);

    // ── Selector Indicator (Arrow next to rows for keyboard users) ──
    ctx.fillStyle = '#ff3399';
    ctx.font = 'bold 16px "Orbitron", sans-serif';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff3399';
    if (row0Focused) {
      ctx.fillText('>', cx - 140, cardY + 145);
    } else if (row1Focused) {
      ctx.fillText('>', startX - 25, fpsY + btnH / 2);
    } else if (row2Focused) {
      ctx.fillText('>', cx - 125, resY + resH / 2);
    }
    ctx.shadowBlur = 0;

    // ── Bottom Prompt ──
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 400);
    ctx.font = '11px "Share Tech Mono", monospace';
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + 0.3 * pulse})`;
    ctx.fillText(this.t('pressEscResume'), cx, cardY + 350);
  }

  // ── GAME LOOP ──────────────────────────────────────────────
  gameLoop(timestamp) {
    // First frame init
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      this.fpsFrameCount = 0;
      this.fpsLimiterAccumulator = 0;
      this.lastFPSCalculationTime = timestamp;
      this.queueNextFrame();
      return;
    }

    let elapsed = timestamp - this.lastTimestamp;

    // Safety check: reset if huge jump occurs (e.g. background tab)
    if (elapsed > 200) {
      this.lastTimestamp = timestamp;
      elapsed = 0;
    }

    // Precise FPS Limiter using fractional error accumulation
    if (this.targetFPS > 0) {
      this.fpsLimiterAccumulator += elapsed;
      const targetInterval = 1000 / this.targetFPS;
      // Allow minor sub-millisecond VSync jitter tolerance of 1.0ms
      if (this.fpsLimiterAccumulator < targetInterval - 1.0) {
        this.lastTimestamp = timestamp;
        this.queueNextFrame();
        return;
      }
      this.fpsLimiterAccumulator -= targetInterval;
      // Prevent backlog accumulation
      if (this.fpsLimiterAccumulator > targetInterval) {
        this.fpsLimiterAccumulator = 0;
      }
    }

    this.lastTimestamp = timestamp;

    // Delta time in seconds, capped to prevent spiral of death
    const dt = Math.min(elapsed / 1000, 0.1);

    // Precise FPS calculation based on actual browser elapsed time
    this.fpsFrameCount++;
    const fpsElapsed = timestamp - this.lastFPSCalculationTime;
    if (fpsElapsed >= 1000) {
      this.currentFPS = Math.round((this.fpsFrameCount * 1000) / fpsElapsed);
      this.fpsFrameCount = 0;
      this.lastFPSCalculationTime = timestamp;
    }

    // Update game logic only when playing
    if (this.state === 'playing') {
      this.update(dt);
    } else {
      // Still update stars & particles for visual polish on menu/gameover
      for (const star of this.stars) star.update(dt);
      for (let i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i].update(dt);
        if (this.particles[i].life <= 0) this.particles.splice(i, 1);
      }
      this.gameTime += dt;
    }

    this.render();
    this.queueNextFrame();
  }

  queueNextFrame() {
    if (this.targetFPS === 0) {
      // Unlimited: use setTimeout(..., 0) to uncap from monitor refresh rate (VSync)
      setTimeout(() => this.gameLoop(performance.now()), 0);
    } else {
      // Limited: use requestAnimationFrame for VSync-synchronized visual updates
      requestAnimationFrame((t) => this.gameLoop(t));
    }
  }

  // ── START ──────────────────────────────────────────────────
  start() {
    // Input listener
    window.addEventListener('keydown', (e) => {
      // Prevent space scrolling, etc.
      if (e.key === ' ' || e.key === 'Enter') e.preventDefault();
      this.handleKeyDown(e);
    });

    // Mouse click listener for pause menu settings
    canvas.addEventListener('click', (e) => {
      if (this.state !== 'paused') return;

      const rect = canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const cardH = 380;
      const cardY = cy - cardH / 2;

      // Language Buttons (Row 0)
      if (clickY >= cardY + 130 && clickY <= cardY + 160) {
        if (clickX >= cx - 110 && clickX <= cx - 10) {
          this.setLanguage('en');
          this.pauseMenuSelectedRow = 0;
        } else if (clickX >= cx + 10 && clickX <= cx + 110) {
          this.setLanguage('id');
          this.pauseMenuSelectedRow = 0;
        }
      }

      // FPS Buttons (Row 1)
      if (clickY >= cardY + 210 && clickY <= cardY + 240) {
        if (clickX >= cx - 181 && clickX <= cx - 101) {
          this.setFPS(60);
          this.pauseMenuSelectedRow = 1;
        } else if (clickX >= cx - 87 && clickX <= cx - 7) {
          this.setFPS(120);
          this.pauseMenuSelectedRow = 1;
        } else if (clickX >= cx + 7 && clickX <= cx + 87) {
          this.setFPS(144);
          this.pauseMenuSelectedRow = 1;
        } else if (clickX >= cx + 101 && clickX <= cx + 181) {
          this.setFPS(0);
          this.pauseMenuSelectedRow = 1;
        }
      }

      // Resume Button (Row 2)
      if (clickY >= cardY + 280 && clickY <= cardY + 320) {
        if (clickX >= cx - 100 && clickX <= cx + 100) {
          this.state = 'playing';
        }
      }
    });

    // Launch the loop
    requestAnimationFrame((t) => this.gameLoop(t));
  }
}

// ─── INITIALIZE & RUN ────────────────────────────────────────
const game = new Game();
game.start();
