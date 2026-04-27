export interface EmojiWord {
  id: number;
  emoji: string;
  english: string;
  chinese: string;
  grade: number;
}

export const emojiWords: EmojiWord[] = [
  // 一年级
  { id: 1, emoji: "🐱", english: "cat", chinese: "猫", grade: 1 },
  { id: 2, emoji: "🐶", english: "dog", chinese: "狗", grade: 1 },
  { id: 3, emoji: "🐟", english: "fish", chinese: "鱼", grade: 1 },
  { id: 4, emoji: "🐦", english: "bird", chinese: "鸟", grade: 1 },
  { id: 5, emoji: "👋", english: "hello", chinese: "你好", grade: 1 },
  { id: 6, emoji: "👧", english: "girl", chinese: "女孩", grade: 1 },
  { id: 7, emoji: "👦", english: "boy", chinese: "男孩", grade: 1 },
  { id: 8, emoji: "📖", english: "book", chinese: "书", grade: 1 },
  { id: 9, emoji: "✏️", english: "pencil", chinese: "铅笔", grade: 1 },
  { id: 10, emoji: "📏", english: "ruler", chinese: "尺子", grade: 1 },
  { id: 11, emoji: "🔴", english: "red", chinese: "红色", grade: 1 },
  { id: 12, emoji: "💛", english: "yellow", chinese: "黄色", grade: 1 },
  { id: 13, emoji: "⬜", english: "white", chinese: "白色", grade: 1 },
  { id: 14, emoji: "⬛", english: "black", chinese: "黑色", grade: 1 },
  { id: 15, emoji: "1️⃣", english: "one", chinese: "一", grade: 1 },

  // 二年级
  { id: 16, emoji: "🍎", english: "apple", chinese: "苹果", grade: 2 },
  { id: 17, emoji: "🍌", english: "banana", chinese: "香蕉", grade: 2 },
  { id: 18, emoji: "🍊", english: "orange", chinese: "橙子", grade: 2 },
  { id: 19, emoji: "🍐", english: "pear", chinese: "梨", grade: 2 },
  { id: 20, emoji: "🍇", english: "grape", chinese: "葡萄", grade: 2 },
  { id: 21, emoji: "💧", english: "water", chinese: "水", grade: 2 },
  { id: 22, emoji: "🥛", english: "milk", chinese: "牛奶", grade: 2 },
  { id: 23, emoji: "🍚", english: "rice", chinese: "米饭", grade: 2 },
  { id: 24, emoji: "🍞", english: "bread", chinese: "面包", grade: 2 },
  { id: 25, emoji: "🥚", english: "egg", chinese: "鸡蛋", grade: 2 },
  { id: 26, emoji: "👩", english: "mother", chinese: "妈妈", grade: 2 },
  { id: 27, emoji: "👨", english: "father", chinese: "爸爸", grade: 2 },
  { id: 28, emoji: "👁️", english: "eye", chinese: "眼睛", grade: 2 },
  { id: 29, emoji: "👃", english: "nose", chinese: "鼻子", grade: 2 },
  { id: 30, emoji: "👄", english: "mouth", chinese: "嘴巴", grade: 2 },
  { id: 31, emoji: "👂", english: "ear", chinese: "耳朵", grade: 2 },
  { id: 32, emoji: "🦶", english: "foot", chinese: "脚", grade: 2 },
  { id: 33, emoji: "😊", english: "happy", chinese: "开心的", grade: 2 },

  // 三年级
  { id: 34, emoji: "🏫", english: "school", chinese: "学校", grade: 3 },
  { id: 35, emoji: "🪑", english: "chair", chinese: "椅子", grade: 3 },
  { id: 36, emoji: "🚪", english: "door", chinese: "门", grade: 3 },
  { id: 37, emoji: "🪟", english: "window", chinese: "窗户", grade: 3 },
  { id: 38, emoji: "🌸", english: "spring", chinese: "春天", grade: 3 },
  { id: 39, emoji: "☀️", english: "summer", chinese: "夏天", grade: 3 },
  { id: 40, emoji: "🍂", english: "autumn", chinese: "秋天", grade: 3 },
  { id: 41, emoji: "⛄", english: "winter", chinese: "冬天", grade: 3 },
  { id: 42, emoji: "🌧️", english: "rainy", chinese: "下雨的", grade: 3 },
  { id: 43, emoji: "🥶", english: "cold", chinese: "寒冷的", grade: 3 },
  { id: 44, emoji: "🥵", english: "hot", chinese: "炎热的", grade: 3 },
  { id: 45, emoji: "🏃", english: "run", chinese: "跑", grade: 3 },
  { id: 46, emoji: "🏊", english: "swim", chinese: "游泳", grade: 3 },
  { id: 47, emoji: "🎤", english: "sing", chinese: "唱歌", grade: 3 },
  { id: 48, emoji: "💃", english: "dance", chinese: "跳舞", grade: 3 },

  // 四年级
  { id: 49, emoji: "🥣", english: "breakfast", chinese: "早餐", grade: 4 },
  { id: 50, emoji: "🍽️", english: "dinner", chinese: "晚餐", grade: 4 },
  { id: 51, emoji: "💻", english: "computer", chinese: "电脑", grade: 4 },
  { id: 52, emoji: "📱", english: "phone", chinese: "电话", grade: 4 },
  { id: 53, emoji: "🎵", english: "music", chinese: "音乐", grade: 4 },
  { id: 54, emoji: "🖼️", english: "picture", chinese: "图片", grade: 4 },
  { id: 55, emoji: "🎨", english: "art", chinese: "美术", grade: 4 },
  { id: 56, emoji: "🤫", english: "quiet", chinese: "安静的", grade: 4 },
  { id: 57, emoji: "💪", english: "strong", chinese: "强壮的", grade: 4 },
  { id: 58, emoji: "🌹", english: "beautiful", chinese: "美丽的", grade: 4 },
  { id: 59, emoji: "🍳", english: "kitchen", chinese: "厨房", grade: 4 },
  { id: 60, emoji: "🛏️", english: "bedroom", chinese: "卧室", grade: 4 },
  { id: 61, emoji: "🌿", english: "garden", chinese: "花园", grade: 4 },

  // 五年级
  { id: 62, emoji: "⛰️", english: "mountain", chinese: "山", grade: 5 },
  { id: 63, emoji: "🏞️", english: "river", chinese: "河流", grade: 5 },
  { id: 64, emoji: "🌲", english: "forest", chinese: "森林", grade: 5 },
  { id: 65, emoji: "🏙️", english: "city", chinese: "城市", grade: 5 },
  { id: 66, emoji: "🏥", english: "hospital", chinese: "医院", grade: 5 },
  { id: 67, emoji: "📚", english: "library", chinese: "图书馆", grade: 5 },
  { id: 68, emoji: "🏪", english: "supermarket", chinese: "超市", grade: 5 },
  { id: 69, emoji: "👨‍⚕️", english: "doctor", chinese: "医生", grade: 5 },
  { id: 70, emoji: "👩‍🌾", english: "farmer", chinese: "农民", grade: 5 },
  { id: 71, emoji: "👮", english: "police", chinese: "警察", grade: 5 },
  { id: 72, emoji: "⭐", english: "excellent", chinese: "优秀的", grade: 5 },
  { id: 73, emoji: "✈️", english: "travel", chinese: "旅行", grade: 5 },

  // 六年级
  { id: 74, emoji: "♻️", english: "recycle", chinese: "回收", grade: 6 },
  { id: 75, emoji: "⚡", english: "energy", chinese: "能源", grade: 6 },
  { id: 76, emoji: "🌍", english: "environment", chinese: "环境", grade: 6 },
  { id: 77, emoji: "🤖", english: "machine", chinese: "机器", grade: 6 },
  { id: 78, emoji: "🌐", english: "internet", chinese: "互联网", grade: 6 },
  { id: 79, emoji: "🏋️", english: "exercise", chinese: "锻炼", grade: 6 },
  { id: 80, emoji: "💊", english: "medicine", chinese: "药", grade: 6 },
  { id: 81, emoji: "🎂", english: "birthday", chinese: "生日", grade: 6 },
  { id: 82, emoji: "🎁", english: "present", chinese: "礼物", grade: 6 },
  { id: 83, emoji: "🎉", english: "celebrate", chinese: "庆祝", grade: 6 },
  { id: 84, emoji: "🧠", english: "knowledge", chinese: "知识", grade: 6 },
  { id: 85, emoji: "🚀", english: "future", chinese: "未来", grade: 6 },
];
