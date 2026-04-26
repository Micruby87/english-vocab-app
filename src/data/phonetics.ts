export interface Phonetic {
  id: number;
  symbol: string;
  type: "vowel" | "consonant";
  category: string;
  exampleWord: string;
  exampleIPA: string;
  exampleChinese: string;
  tip: string;
}

export const phonetics: Phonetic[] = [
  // ========== 元音 Vowels (20个) ==========
  // 单元音 - 长元音 (5)
  { id: 1, symbol: "/iː/", type: "vowel", category: "长元音", exampleWord: "sheep", exampleIPA: "/ʃiːp/", exampleChinese: "绵羊", tip: `嘴角向两边拉开，像微笑，发"衣"的长音` },
  { id: 2, symbol: "/ɑː/", type: "vowel", category: "长元音", exampleWord: "car", exampleIPA: "/kɑː/", exampleChinese: "汽车", tip: `嘴巴张大，舌头放平放低，发"啊"的长音` },
  { id: 3, symbol: "/ɔː/", type: "vowel", category: "长元音", exampleWord: "door", exampleIPA: "/dɔː/", exampleChinese: "门", tip: `嘴巴张圆，像打哈欠，发"哦"的长音` },
  { id: 4, symbol: "/uː/", type: "vowel", category: "长元音", exampleWord: "food", exampleIPA: "/fuːd/", exampleChinese: "食物", tip: `嘴唇收圆向前突出，发"乌"的长音` },
  { id: 5, symbol: "/ɜː/", type: "vowel", category: "长元音", exampleWord: "bird", exampleIPA: "/bɜːd/", exampleChinese: "鸟", tip: `嘴巴半开，舌头中间微微抬起，类似"额"的长音` },

  // 单元音 - 短元音 (7)
  { id: 6, symbol: "/ɪ/", type: "vowel", category: "短元音", exampleWord: "fish", exampleIPA: "/fɪʃ/", exampleChinese: "鱼", tip: `嘴巴微张，比/iː/放松，短促发"衣"` },
  { id: 7, symbol: "/e/", type: "vowel", category: "短元音", exampleWord: "bed", exampleIPA: "/bed/", exampleChinese: "床", tip: `嘴巴半开，舌头前部微抬，发"哎"的短音` },
  { id: 8, symbol: "/æ/", type: "vowel", category: "短元音", exampleWord: "cat", exampleIPA: "/kæt/", exampleChinese: "猫", tip: `嘴巴张大，嘴角向两边拉，像笑着说"啊"` },
  { id: 9, symbol: "/ʌ/", type: "vowel", category: "短元音", exampleWord: "cup", exampleIPA: "/kʌp/", exampleChinese: "杯子", tip: `嘴巴微张，发短促的"阿"，像被吓一跳` },
  { id: 10, symbol: "/ɒ/", type: "vowel", category: "短元音", exampleWord: "hot", exampleIPA: "/hɒt/", exampleChinese: "热的", tip: `嘴巴张圆，短促发"奥"` },
  { id: 11, symbol: "/ʊ/", type: "vowel", category: "短元音", exampleWord: "book", exampleIPA: "/bʊk/", exampleChinese: "书", tip: `嘴唇微圆，比/uː/放松，短促发"乌"` },
  { id: 12, symbol: "/ə/", type: "vowel", category: "短元音", exampleWord: "about", exampleIPA: "/əˈbaʊt/", exampleChinese: "关于", tip: `最轻最弱的音，嘴巴自然微张，轻轻发"额"` },

  // 双元音 (8)
  { id: 13, symbol: "/eɪ/", type: "vowel", category: "双元音", exampleWord: "cake", exampleIPA: "/keɪk/", exampleChinese: "蛋糕", tip: `先发/e/再滑向/ɪ/，像说"诶"` },
  { id: 14, symbol: "/aɪ/", type: "vowel", category: "双元音", exampleWord: "bike", exampleIPA: "/baɪk/", exampleChinese: "自行车", tip: `先张嘴发"啊"再滑向/ɪ/，像说"爱"` },
  { id: 15, symbol: "/ɔɪ/", type: "vowel", category: "双元音", exampleWord: "boy", exampleIPA: "/bɔɪ/", exampleChinese: "男孩", tip: `先圆嘴发/ɔ/再滑向/ɪ/，像说"哦伊"` },
  { id: 16, symbol: "/aʊ/", type: "vowel", category: "双元音", exampleWord: "cow", exampleIPA: "/kaʊ/", exampleChinese: "奶牛", tip: `先张嘴发"啊"再滑向/ʊ/，像说"奥"` },
  { id: 17, symbol: "/əʊ/", type: "vowel", category: "双元音", exampleWord: "go", exampleIPA: "/ɡəʊ/", exampleChinese: "去", tip: `先发/ə/再滑向/ʊ/，像说"欧"` },
  { id: 18, symbol: "/ɪə/", type: "vowel", category: "双元音", exampleWord: "ear", exampleIPA: "/ɪə/", exampleChinese: "耳朵", tip: `先发/ɪ/再滑向/ə/，像说"衣额"` },
  { id: 19, symbol: "/eə/", type: "vowel", category: "双元音", exampleWord: "hair", exampleIPA: "/heə/", exampleChinese: "头发", tip: `先发/e/再滑向/ə/，像说"哎额"` },
  { id: 20, symbol: "/ʊə/", type: "vowel", category: "双元音", exampleWord: "tour", exampleIPA: "/tʊə/", exampleChinese: "旅行", tip: `先发/ʊ/再滑向/ə/，像说"乌额"` },

  // ========== 辅音 Consonants (28个) ==========
  // 爆破音 (6)
  { id: 21, symbol: "/p/", type: "consonant", category: "爆破音", exampleWord: "pen", exampleIPA: "/pen/", exampleChinese: "钢笔", tip: "双唇紧闭再突然张开，送气，像吹蜡烛" },
  { id: 22, symbol: "/b/", type: "consonant", category: "爆破音", exampleWord: "bag", exampleIPA: "/bæɡ/", exampleChinese: "书包", tip: "双唇紧闭再张开，声带振动，不送气" },
  { id: 23, symbol: "/t/", type: "consonant", category: "爆破音", exampleWord: "tea", exampleIPA: "/tiː/", exampleChinese: "茶", tip: "舌尖抵上齿龈再弹开，送气" },
  { id: 24, symbol: "/d/", type: "consonant", category: "爆破音", exampleWord: "dog", exampleIPA: "/dɒɡ/", exampleChinese: "狗", tip: "舌尖抵上齿龈再弹开，声带振动" },
  { id: 25, symbol: "/k/", type: "consonant", category: "爆破音", exampleWord: "cat", exampleIPA: "/kæt/", exampleChinese: "猫", tip: "舌后部抵软腭再弹开，送气" },
  { id: 26, symbol: "/ɡ/", type: "consonant", category: "爆破音", exampleWord: "go", exampleIPA: "/ɡəʊ/", exampleChinese: "去", tip: "舌后部抵软腭再弹开，声带振动" },

  // 摩擦音 (10)
  { id: 27, symbol: "/f/", type: "consonant", category: "摩擦音", exampleWord: "fish", exampleIPA: "/fɪʃ/", exampleChinese: "鱼", tip: "上齿轻咬下唇，气流从缝隙挤出" },
  { id: 28, symbol: "/v/", type: "consonant", category: "摩擦音", exampleWord: "very", exampleIPA: "/ˈveri/", exampleChinese: "非常", tip: "上齿轻咬下唇，声带振动" },
  { id: 29, symbol: "/θ/", type: "consonant", category: "摩擦音", exampleWord: "think", exampleIPA: "/θɪŋk/", exampleChinese: "想", tip: "舌尖放在上下齿之间，气流从舌齿缝挤出" },
  { id: 30, symbol: "/ð/", type: "consonant", category: "摩擦音", exampleWord: "this", exampleIPA: "/ðɪs/", exampleChinese: "这个", tip: "舌尖放在上下齿之间，声带振动" },
  { id: 31, symbol: "/s/", type: "consonant", category: "摩擦音", exampleWord: "sun", exampleIPA: "/sʌn/", exampleChinese: "太阳", tip: "舌尖靠近上齿龈，气流从窄缝挤出，像蛇的声音" },
  { id: 32, symbol: "/z/", type: "consonant", category: "摩擦音", exampleWord: "zoo", exampleIPA: "/zuː/", exampleChinese: "动物园", tip: "舌尖靠近上齿龈，声带振动，像蜜蜂嗡嗡" },
  { id: 33, symbol: "/ʃ/", type: "consonant", category: "摩擦音", exampleWord: "ship", exampleIPA: "/ʃɪp/", exampleChinese: "轮船", tip: `嘴唇微微向前突出，像说"嘘"让人安静` },
  { id: 34, symbol: "/ʒ/", type: "consonant", category: "摩擦音", exampleWord: "measure", exampleIPA: "/ˈmeʒə/", exampleChinese: "测量", tip: "嘴唇微突，声带振动，类似/ʃ/的浊音版" },
  { id: 35, symbol: "/h/", type: "consonant", category: "摩擦音", exampleWord: "hat", exampleIPA: "/hæt/", exampleChinese: "帽子", tip: "嘴巴张开，像哈气，气流从喉咙出来" },
  { id: 36, symbol: "/r/", type: "consonant", category: "摩擦音", exampleWord: "red", exampleIPA: "/red/", exampleChinese: "红色", tip: "舌尖向上卷起不碰到任何地方，声带振动" },

  // 破擦音 (6)
  { id: 37, symbol: "/tʃ/", type: "consonant", category: "破擦音", exampleWord: "chair", exampleIPA: "/tʃeə/", exampleChinese: "椅子", tip: `先/t/后/ʃ/，像打喷嚏"吃"` },
  { id: 38, symbol: "/dʒ/", type: "consonant", category: "破擦音", exampleWord: "juice", exampleIPA: "/dʒuːs/", exampleChinese: "果汁", tip: `先/d/后/ʒ/，声带振动，像说"之"` },
  { id: 39, symbol: "/ts/", type: "consonant", category: "破擦音", exampleWord: "cats", exampleIPA: "/kæts/", exampleChinese: "猫(复数)", tip: "先/t/后/s/，舌尖抵齿龈后快速弹开" },
  { id: 40, symbol: "/dz/", type: "consonant", category: "破擦音", exampleWord: "beds", exampleIPA: "/bedz/", exampleChinese: "床(复数)", tip: "先/d/后/z/，声带振动" },
  { id: 41, symbol: "/tr/", type: "consonant", category: "破擦音", exampleWord: "tree", exampleIPA: "/triː/", exampleChinese: "树", tip: "先/t/后/r/，舌尖先抵齿龈再卷起" },
  { id: 42, symbol: "/dr/", type: "consonant", category: "破擦音", exampleWord: "dream", exampleIPA: "/driːm/", exampleChinese: "梦想", tip: "先/d/后/r/，声带振动" },

  // 鼻音 (3)
  { id: 43, symbol: "/m/", type: "consonant", category: "鼻音", exampleWord: "mom", exampleIPA: "/mɒm/", exampleChinese: "妈妈", tip: `双唇紧闭，气流从鼻腔出来，像"嗯"` },
  { id: 44, symbol: "/n/", type: "consonant", category: "鼻音", exampleWord: "nose", exampleIPA: "/nəʊz/", exampleChinese: "鼻子", tip: "舌尖抵上齿龈，气流从鼻腔出来" },
  { id: 45, symbol: "/ŋ/", type: "consonant", category: "鼻音", exampleWord: "sing", exampleIPA: "/sɪŋ/", exampleChinese: "唱歌", tip: "舌后部抵软腭，气流从鼻腔出来" },

  // 半元音 (2)
  { id: 46, symbol: "/j/", type: "consonant", category: "半元音", exampleWord: "yes", exampleIPA: "/jes/", exampleChinese: "是的", tip: `像快速发/iː/然后滑向后面的元音，像说"耶"` },
  { id: 47, symbol: "/w/", type: "consonant", category: "半元音", exampleWord: "water", exampleIPA: "/ˈwɔːtə/", exampleChinese: "水", tip: "嘴唇收圆突出，像快速发/uː/再滑向元音" },

  // 舌侧音 (1)
  { id: 48, symbol: "/l/", type: "consonant", category: "舌侧音", exampleWord: "lion", exampleIPA: "/ˈlaɪən/", exampleChinese: "狮子", tip: "舌尖抵上齿龈，气流从舌头两侧出来" },
];

export const vowelCategories = ["长元音", "短元音", "双元音"];
export const consonantCategories = ["爆破音", "摩擦音", "破擦音", "鼻音", "半元音", "舌侧音"];
