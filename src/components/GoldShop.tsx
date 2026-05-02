import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { getProgress, saveProgress } from '../utils/storage';
import type { UserProgress } from '../utils/storage';

interface GoldShopProps {
  onBack: () => void;
}

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
}

const shopItems: ShopItem[] = [
  {
    id: 'hp_potion',
    name: '生命药水',
    description: '恢复 20 点生命值',
    price: 50,
    emoji: '❤️',
  },
  {
    id: 'atk_boost',
    name: '攻击增益',
    description: '下次战斗攻击力提高 10% (一次性)',
    price: 75,
    emoji: '⚔️',
  },
  {
    id: 'lucky_charm',
    name: '幸运符',
    description: '下次战斗金币获取量增加 20% (一次性)',
    price: 100,
    emoji: '🍀',
  },
];

export default function GoldShop({ onBack }: GoldShopProps) {
  const [userGold, setUserGold] = React.useState(0);
  const [message, setMessage] = React.useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

  React.useEffect(() => {
    const progress = getProgress();
    setUserGold(progress.gold);
  }, []);

  const handlePurchase = (item: ShopItem) => {
    if (userGold >= item.price) {
      const newGold = userGold - item.price;
      setUserGold(newGold);
      const currentProgress = getProgress();
      saveProgress({ ...currentProgress, gold: newGold });
      setMessage({ text: `成功购买 ${item.name}！`, type: 'success' });
      // Here you would typically add the item to the user's inventory or apply its effect.
      // For this example, we'll just show a success message.
      console.log(`User purchased ${item.name}`);
    } else {
      setMessage({ text: `金币不足，无法购买 ${item.name}。`, type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#f0f2f5', paddingBottom: 20 }}>
      <div style={{
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        borderRadius: '0 0 28px 28px',
        padding: '48px 20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 12, padding: '8px 12px' }}>
          <ArrowLeft style={{ width: 20, height: 20, color: '#fff' }} />
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>💰 金币商店</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: '6px 12px' }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{userGold}</span>
          <span style={{ fontSize: 14, color: '#fff' }}>金币</span>
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {message.text && (
          <div style={{
            background: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            padding: '12px 16px', borderRadius: 12, textAlign: 'center',
            fontWeight: 600, transition: 'opacity 0.3s ease-in-out',
          }}>
            {message.text}
          </div>
        )}

        {shopItems.map((item) => (
          <div key={item.id} style={{
            background: '#fff', borderRadius: 16, padding: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{ fontSize: 40 }}>{item.emoji}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{item.name}</h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{item.description}</p>
            </div>
            <button
              onClick={() => handlePurchase(item)}
              style={{
                background: userGold >= item.price ? 'linear-gradient(135deg, #34d399, #059669)' : '#cbd5e1',
                color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px',
                fontSize: 14, fontWeight: 700, cursor: userGold >= item.price ? 'pointer' : 'not-allowed',
                transition: 'background 0.3s', whiteSpace: 'nowrap',
              }}
              disabled={userGold < item.price}
            >
              💰 {item.price}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
