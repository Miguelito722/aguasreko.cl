import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Bidón Retornable 20L',
    price: 3500,
    description: 'La opción ideal para tu dispensador. Perfecto para mantener a toda la familia hidratada. ¡Sustentable y conveniente!',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1000&auto=format&fit=crop',
    category: 'bidon'
  },
  {
    id: '2',
    name: 'Dispensador Eléctrico',
    price: 89990,
    description: 'Agua fría al instante para refrescarte y agua caliente para tus infusiones. Comodidad y estilo para tu hogar u oficina.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop',
    category: 'dispensador'
  },
  {
    id: '3',
    name: 'Pack 12 Botellas 500ml',
    price: 4800,
    description: 'La dosis perfecta de hidratación para llevar al trabajo o al gimnasio. ¡Lleva la pureza Reko contigo!',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=1000&auto=format&fit=crop',
    category: 'botellas'
  },
  {
    id: '4',
    name: 'Dispensador para Mascotas',
    price: 24990,
    description: 'Mantén a tu mejor amigo siempre hidratado con agua fresca y limpia. Perfecto para perros y gatos de todos los tamaños.',
    image: '/image copy.png',
    category: 'dispensador'
  }
];