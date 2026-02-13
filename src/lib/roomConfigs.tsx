import { RoomConfig, RoomType } from '@/types/visualizer';

export const ROOM_CONFIGS: Record<RoomType, RoomConfig> = {
  bedroom: {
    type: 'bedroom',
    name: 'Bedroom',
    dimensions: {
      width: 400,
      height: 350,
      color: '#E8DCC8',
    },
    backgroundColor: '#FBF8F3',
    furnitureColor: '#8B7355',
    maxProducts: 8,
  },
  livingroom: {
    type: 'livingroom',
    name: 'Living Room',
    dimensions: {
      width: 500,
      height: 400,
      color: '#E8DEC4',
    },
    backgroundColor: '#F5F3ED',
    furnitureColor: '#9B8B7B',
    maxProducts: 10,
  },
  kitchen: {
    type: 'kitchen',
    name: 'Kitchen',
    dimensions: {
      width: 450,
      height: 350,
      color: '#EEEBEA',
    },
    backgroundColor: '#FEFDFB',
    furnitureColor: '#B8A89A',
    maxProducts: 6,
  },
  bathroom: {
    type: 'bathroom',
    name: 'Bathroom',
    dimensions: {
      width: 300,
      height: 320,
      color: '#F0F4F8',
    },
    backgroundColor: '#F8FAFC',
    furnitureColor: '#A0B0C0',
    maxProducts: 5,
  },
  diningroom: {
    type: 'diningroom',
    name: 'Dining Room',
    dimensions: {
      width: 480,
      height: 380,
      color: '#E4D4C8',
    },
    backgroundColor: '#F9F6F2',
    furnitureColor: '#8A6F5E',
    maxProducts: 8,
  },
};

/**
 * Room background component using SVG
 */
export function RoomBackground({ roomType }: { roomType: RoomType }) {
  const config = ROOM_CONFIGS[roomType];

  const svgMap: Record<RoomType, string> = {
    bedroom: `
      <svg viewBox="0 0 400 350" xmlns="http://www.w3.org/2000/svg">
        <!-- Floor -->
        <rect width="400" height="350" fill="${config.backgroundColor}"/>
        <!-- Left wall -->
        <rect width="20" height="350" fill="#E8DCC8" opacity="0.8"/>
        <!-- Right wall -->
        <rect x="380" width="20" height="350" fill="#E8DCC8" opacity="0.8"/>
        <!-- Top wall -->
        <rect width="400" height="20" fill="#E8DCC8" opacity="0.8"/>
        <!-- Window -->
        <rect x="250" y="5" width="100" height="15" fill="#87CEEB" opacity="0.6" rx="3"/>
        <!-- Door -->
        <rect x="10" y="200" width="15" height="80" fill="#8B7355" opacity="0.7"/>
        <!-- Bed frame (simple) -->
        <rect x="50" y="50" width="200" height="140" fill="none" stroke="#8B7355" stroke-width="3" opacity="0.5"/>
        <!-- Nightstand -->
        <rect x="270" y="80" width="70" height="50" fill="#A0826D" opacity="0.6" rx="2"/>
        <!-- Shelf -->
        <line x1="80" y1="220" x2="280" y2="220" stroke="#8B7355" stroke-width="3" opacity="0.5"/>
      </svg>
    `,
    livingroom: `
      <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
        <!-- Floor -->
        <rect width="500" height="400" fill="${config.backgroundColor}"/>
        <!-- Walls -->
        <rect width="20" height="400" fill="#E8DEC4" opacity="0.8"/>
        <rect x="480" width="20" height="400" fill="#E8DEC4" opacity="0.8"/>
        <rect width="500" height="20" fill="#E8DEC4" opacity="0.8"/>
        <rect width="500" y="380" height="20" fill="#E8DEC4" opacity="0.8"/>
        <!-- Window -->
        <rect x="320" y="5" width="120" height="15" fill="#87CEEB" opacity="0.6" rx="3"/>
        <!-- Door -->
        <rect x="10" y="250" width="15" height="100" fill="#8B7355" opacity="0.7"/>
        <!-- Sofa -->
        <rect x="50" y="80" width="200" height="80" fill="#9B8B7B" opacity="0.4" rx="5"/>
        <!-- Coffee table -->
        <ellipse cx="200" cy="200" rx="60" ry="40" fill="#A0826D" opacity="0.5"/>
        <!-- TV stand -->
        <rect x="320" y="150" width="120" height="60" fill="#8B7355" opacity="0.5" rx="3"/>
      </svg>
    `,
    kitchen: `
      <svg viewBox="0 0 450 350" xmlns="http://www.w3.org/2000/svg">
        <!-- Floor -->
        <rect width="450" height="350" fill="${config.backgroundColor}"/>
        <!-- Walls -->
        <rect width="20" height="350" fill="#EEEBEA" opacity="0.8"/>
        <rect x="430" width="20" height="350" fill="#EEEBEA" opacity="0.8"/>
        <rect width="450" height="20" fill="#EEEBEA" opacity="0.8"/>
        <!-- Counter -->
        <rect x="30" y="250" width="200" height="80" fill="#B8A89A" opacity="0.6" rx="3"/>
        <!-- Sink -->
        <circle cx="100" cy="270" r="20" fill="#C0C0C0" opacity="0.7"/>
        <!-- Stove -->
        <rect x="250" y="260" width="60" height="60" fill="#505050" opacity="0.7" rx="3"/>
        <!-- Refrigerator -->
        <rect x="80" y="50" width="80" height="120" fill="#DADADA" opacity="0.7" rx="3"/>
        <!-- Island -->
        <rect x="250" y="120" width="100" height="80" fill="#C4A57B" opacity="0.5" rx="3"/>
      </svg>
    `,
    bathroom: `
      <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg">
        <!-- Floor -->
        <rect width="300" height="320" fill="${config.backgroundColor}"/>
        <!-- Walls -->
        <rect width="15" height="320" fill="#F0F4F8" opacity="0.8"/>
        <rect x="285" width="15" height="320" fill="#F0F4F8" opacity="0.8"/>
        <rect width="300" height="15" fill="#F0F4F8" opacity="0.8"/>
        <!-- Bathtub -->
        <rect x="30" y="40" width="120" height="70" fill="#E8F4F8" opacity="0.7" rx="5" stroke="#A0B0C0" stroke-width="2"/>
        <!-- Sink -->
        <rect x="170" y="60" width="90" height="50" fill="#E8E8E8" opacity="0.7" rx="3"/>
        <!-- Toilet -->
        <ellipse cx="90" cy="180" rx="25" ry="35" fill="#F5F5F5" opacity="0.7" stroke="#A0B0C0" stroke-width="2"/>
        <!-- Shelf -->
        <line x1="30" y1="280" x2="270" y2="280" stroke="#A0B0C0" stroke-width="3" opacity="0.6"/>
      </svg>
    `,
    diningroom: `
      <svg viewBox="0 0 480 380" xmlns="http://www.w3.org/2000/svg">
        <!-- Floor -->
        <rect width="480" height="380" fill="${config.backgroundColor}"/>
        <!-- Walls -->
        <rect width="20" height="380" fill="#E4D4C8" opacity="0.8"/>
        <rect x="460" width="20" height="380" fill="#E4D4C8" opacity="0.8"/>
        <rect width="480" height="20" fill="#E4D4C8" opacity="0.8"/>
        <!-- Door -->
        <rect x="10" y="100" width="15" height="80" fill="#8A6F5E" opacity="0.7"/>
        <!-- Dining table -->
        <ellipse cx="240" cy="150" rx="120" ry="80" fill="#8A6F5E" opacity="0.5"/>
        <!-- Chair 1 -->
        <rect x="100" y="260" width="50" height="60" fill="#6F5A4A" opacity="0.5" rx="3"/>
        <!-- Chair 2 -->
        <rect x="330" y="260" width="50" height="60" fill="#6F5A4A" opacity="0.5" rx="3"/>
        <!-- Sideboard -->
        <rect x="350" y="40" width="100" height="80" fill="#7A5F50" opacity="0.5" rx="3"/>
      </svg>
    `,
  };

  return (
    <div
      className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden border-4 border-gray-300"
      dangerouslySetInnerHTML={{ __html: svgMap[roomType] }}
    />
  );
}
