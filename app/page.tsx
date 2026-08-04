"use client";

import { useEffect, useMemo, useState } from "react";

type PhilosophyKey =
  | "existentialism"
  | "absurdism"
  | "stoicism"
  | "epicureanism"
  | "humanism"
  | "skepticism"
  | "idealism"
  | "naturalism"
  | "determinism"
  | "nihilism"
  | "transhumanism"
  | "simulationism";

type Question = {
  text: string;
  constellation: string;
  weights: Partial<Record<PhilosophyKey, number>>;
};

type Profile = {
  name: string;
  english: string;
  sigil: string;
  motto: string;
  description: string;
  light: string;
  shadow: string;
  coreQuestion: string;
  history: string;
  ideas: string[];
  misconception: string;
  thinkers: string;
  reflection: string;
};

const profiles: Record<PhilosophyKey, Profile> = {
  existentialism: {
    name: "存在主义",
    english: "EXISTENTIALISM",
    sigil: "自由之刃",
    motto: "世界没有替你写好答案，于是你亲手落笔。",
    description: "你不等待宇宙授予意义。对你来说，人先存在，然后在选择、承担与创造里成为自己。自由并不轻盈，但你宁愿承受它的重量，也不愿把人生交给现成剧本。",
    light: "真实、自由、敢于自我定义",
    shadow: "容易把每个选择都感受成审判",
    coreQuestion: "成为我自己",
    history: "存在主义在 19—20 世纪欧洲形成鲜明传统。它不先问“人类共同的本质是什么”，而是从一个具体的人，如何在没有现成答案的世界里生活开始。",
    ideas: ["存在先于本质：人不是带着固定说明书出生的。", "自由总与责任相连；不选择，本身也是一种选择。", "焦虑并非纯粹故障，它常来自我们意识到自己能够选择。"],
    misconception: "它不是“只顾自己”或悲观主义。存在主义强调真实地选择，也强调承担选择对他人的影响。",
    thinkers: "索伦·克尔凯郭尔、弗里德里希·尼采、让-保罗·萨特、西蒙娜·德·波伏娃",
    reflection: "如果没有任何角色替你定义，你愿意怎样成为自己？",
  },
  absurdism: {
    name: "荒诞主义",
    english: "ABSURDISM",
    sigil: "反叛之火",
    motto: "宇宙沉默，我仍决定热烈地回答。",
    description: "你看见人类渴望意义，而世界拒绝作答——这道裂缝正是荒诞。你不靠虚假的确定性逃离，也不向虚无投降；你会清醒地活、创造、爱，甚至对深渊露出一点坏笑。",
    light: "清醒、韧性、带着幽默反抗",
    shadow: "可能用戏谑藏起真正的疲惫",
    coreQuestion: "在沉默中燃烧",
    history: "荒诞主义关注人的意义渴望与宇宙沉默之间的冲突。加缪把这种无法彻底消除的张力称为“荒诞”。",
    ideas: ["人渴望确定意义，世界却不保证回答。", "逃避、虚假确信与彻底放弃都不是唯一出路。", "清醒地生活、体验和创造，本身就是对荒诞的反抗。"],
    misconception: "荒诞主义不是“什么都无所谓”。它恰恰主张在没有终极保证时，仍然认真生活。",
    thinkers: "阿尔贝·加缪；也常与卡夫卡、陀思妥耶夫斯基的文学世界对读",
    reflection: "如果世界不给答案，你仍愿意为什么事保持热烈？",
  },
  stoicism: {
    name: "斯多葛主义",
    english: "STOICISM",
    sigil: "静默之环",
    motto: "风暴不由我，但掌舵的手属于我。",
    description: "你会把混乱切成两部分：能够改变的，与必须接受的。你相信尊严来自判断与行动，而不是外界奖赏。克制对你不是冷漠，而是一种不让世界随意侵入内核的技术。",
    light: "稳定、自持、行动清晰",
    shadow: "可能把需要被感受的东西过早压平",
    coreQuestion: "守住内在秩序",
    history: "斯多葛主义诞生于古希腊，后在古罗马发展。它是一套关于判断、德性和行动的生活哲学。",
    ideas: ["区分能够控制的判断与行动，和无法控制的结果与他人。", "真正的好来自品格与德性，而非名望、财富或运气。", "情绪需要被理解和校准，不是被粗暴消灭。"],
    misconception: "斯多葛并不等于冷漠或忍受一切；它要求人在可以行动的地方勇敢行动。",
    thinkers: "芝诺、爱比克泰德、塞涅卡、马可·奥勒留",
    reflection: "今天有哪些事值得你行动，哪些事可以停止反复控制？",
  },
  epicureanism: {
    name: "伊壁鸠鲁主义",
    english: "EPICUREANISM",
    sigil: "月桂花园",
    motto: "幸福不是盛宴，是不再被匮乏追赶。",
    description: "你相信好的生活不必宏大。友谊、宁静、身体免于痛苦、欲望被温柔地辨认，已经足够珍贵。你追求的不是纵欲，而是从无尽的渴求里退一步，重新听见生活本身。",
    light: "细腻、知足、懂得真正的愉悦",
    shadow: "可能为保护宁静而回避必要的冒险",
    coreQuestion: "让心安静下来",
    history: "伊壁鸠鲁在古希腊建立“花园学园”，主张通过理解欲望、自然与死亡，获得安宁而清醒的快乐。",
    ideas: ["快乐首先是身体少受痛苦、心灵少受恐惧。", "区分自然且必要的欲望，与被社会放大的无尽欲望。", "友谊、节制与思考，比奢华更可靠。"],
    misconception: "它不是纵欲主义。伊壁鸠鲁式快乐更接近简单、稳定和没有匮乏感。",
    thinkers: "伊壁鸠鲁、卢克莱修",
    reflection: "拿走比较和表演之后，什么仍能让你真正满足？",
  },
  humanism: {
    name: "人文主义",
    english: "HUMANISM",
    sigil: "共鸣之光",
    motto: "即使没有神谕，人仍值得被认真对待。",
    description: "你把人的尊严、同情与创造力放在中心。意义未必来自宇宙尺度，它也可以诞生于人与人的照见、知识的传递和对痛苦的减少。你相信文明是一项必须共同维护的作品。",
    light: "共情、责任感、相信共同进步",
    shadow: "容易替整个人类承担过多失望",
    coreQuestion: "让世界更像人的家",
    history: "人文主义在文艺复兴时期获得重要形态，后来发展出世俗与宗教等不同版本，共同关心人的尊严、教育与创造潜能。",
    ideas: ["人具有值得尊重的主体性和发展能力。", "伦理可以从同情、理性、经验与共同生活中建立。", "知识、艺术和制度应帮助人更充分地生活。"],
    misconception: "人文主义不是认为人类永远正确，也不等于忽视自然；它要求人对自身力量负责。",
    thinkers: "伊拉斯谟、皮科·德拉·米兰多拉，以及现代世俗人文主义传统",
    reflection: "你希望哪些人的处境，因为你的存在而变得更有尊严？",
  },
  skepticism: {
    name: "怀疑主义",
    english: "SKEPTICISM",
    sigil: "雾中之眼",
    motto: "我不急着相信，也不急着否定。",
    description: "你对漂亮而确定的答案保持距离。比起拥有结论，你更在意结论如何被证明、语言藏住了什么、自己又可能错在哪里。悬置判断不是软弱，而是你保护真实的方式。",
    light: "敏锐、独立、不易被操纵",
    shadow: "可能不断拆解，直到无处落脚",
    coreQuestion: "辨认真与幻",
    history: "怀疑主义可追溯到古希腊皮浪主义和学院派怀疑传统，后来成为现代科学与认识论的重要方法。",
    ideas: ["感觉、语言和推理都可能出错。", "证据不足时，暂缓判断比仓促确信更诚实。", "怀疑也必须怀疑自身，避免变成另一种教条。"],
    misconception: "怀疑主义不是拒绝相信一切，而是让信念与证据的强度相匹配。",
    thinkers: "皮浪、塞克斯都·恩披里柯、戴维·休谟",
    reflection: "你最确信的观点，如果错了，什么证据会让你改变？",
  },
  idealism: {
    name: "唯心主义",
    english: "IDEALISM",
    sigil: "意识水晶",
    motto: "也许世界最深的材质，本来就是心灵。",
    description: "你直觉地认为，意识并非物质世界偶然溅起的泡沫。经验、观念与感知可能比所谓客观实体更接近存在的核心。你愿意认真凝视梦、象征和主体性留下的裂光。",
    light: "想象力、精神深度、感知丰沛",
    shadow: "可能让迷人的解释跑在证据前面",
    coreQuestion: "理解意识本身",
    history: "哲学中的唯心主义有多种版本，共同认为心灵、观念或经验，在理解现实结构时处于基础地位。",
    ideas: ["我们接触世界，总要经过意识、概念与感知。", "现实未必能被还原成与心灵无关的纯物质。", "不同唯心主义对“世界是否独立存在”有不同回答。"],
    misconception: "它不等于“想什么就会发生”，也不是否认日常世界，而是追问世界如何成为可经验的世界。",
    thinkers: "柏拉图、乔治·贝克莱、伊曼努尔·康德、黑格尔",
    reflection: "当你说“现实”时，有多少来自世界，有多少来自你的感知方式？",
  },
  naturalism: {
    name: "自然主义",
    english: "NATURALISM",
    sigil: "群星之骨",
    motto: "我们属于宇宙，而不是宇宙的例外。",
    description: "你相信自然世界已经足够神奇，无需额外的超自然层。意识、爱与文明可以极其珍贵，同时仍由物质、演化与因果构成。理解机制不会消解诗意，反而让敬畏更精确。",
    light: "求真、清晰、尊重证据",
    shadow: "可能低估主观经验无法量化的部分",
    coreQuestion: "看清世界如何运转",
    history: "自然主义认为世界可以在自然因果和经验研究的框架内理解，不需要额外诉诸超自然实体。",
    ideas: ["人类与意识属于自然的一部分，而非自然之外的例外。", "知识应与可观察证据和可靠方法相协调。", "自然解释不会自动取消价值、情感与艺术。"],
    misconception: "自然主义不是认为“只有冷冰冰的物质才重要”，而是认为珍贵事物也能在自然世界中真实存在。",
    thinkers: "大卫·休谟、约翰·杜威，以及当代科学自然主义传统",
    reflection: "如果理解机制不会破坏诗意，你最想看清什么如何发生？",
  },
  determinism: {
    name: "决定论",
    english: "DETERMINISM",
    sigil: "因果之链",
    motto: "每颗星的轨迹，都从更早的星尘开始。",
    description: "你敏锐地看见选择背后的基因、经历、环境与物理因果。所谓自由意志也许没有人们想象得独立，但理解限制并不等于放弃行动；它让责备变少，让改变条件变得更重要。",
    light: "洞察因果、少些道德傲慢",
    shadow: "可能把尚未发生的未来误认成注定",
    coreQuestion: "理解塑造我的力量",
    history: "决定论主张事件由先前条件与规律所塑造。它横跨形而上学、物理学、心理学和自由意志讨论。",
    ideas: ["选择受到基因、环境、经历和当下状态的深刻影响。", "因果决定不必等于宿命；知道原因，可以改变后续条件。", "相容论认为，某种自由可以与因果决定并存。"],
    misconception: "决定论不是“努力没用”。努力本身，也能成为改变未来的原因。",
    thinkers: "斯宾诺莎、拉普拉斯；当代相容论代表丹尼尔·丹尼特",
    reflection: "哪些力量塑造了你，而你又能把哪些新原因带进未来？",
  },
  nihilism: {
    name: "虚无主义",
    english: "NIHILISM",
    sigil: "黑曜王冠",
    motto: "旧价值崩塌之后，黑夜不会替你撒谎。",
    description: "你能穿透许多被习惯包装成真理的价值。宇宙没有显而易见的目的，道德与身份也可能是人的建构。你的力量是诚实地清场；真正的考验，是清场以后是否愿意留下自己的创造。",
    light: "彻底、诚实、不受虚假权威束缚",
    shadow: "拆掉一切后，可能忘记自己也能建造",
    coreQuestion: "穿过价值的废墟",
    history: "虚无主义质疑价值、知识或意义是否具有客观基础。19 世纪以后，它成为现代性危机的重要名称。",
    ideas: ["传统价值未必天然、永恒或由宇宙保证。", "拆解虚假权威可以带来自由，也可能留下价值真空。", "虚无主义既可作为诊断，也可成为需要跨越的阶段。"],
    misconception: "它不必然等于绝望或破坏。识别没有现成意义，与拒绝创造任何意义，并不是一回事。",
    thinkers: "常与尼采的虚无主义诊断、屠格涅夫笔下的俄国虚无主义相关",
    reflection: "当旧价值不再可信，你愿意保留或创造什么？",
  },
  transhumanism: {
    name: "超人类主义",
    english: "TRANSHUMANISM",
    sigil: "未来之翼",
    motto: "人类不是完成品，而是一段仍可改写的代码。",
    description: "你把技术看作意识继续演化的器官。疾病、衰老乃至认知边界，都不必被浪漫化为不可触碰的命运。你愿意押注更辽阔的未来，也会追问：升级之后，我们还想保留什么叫作人。",
    light: "远见、创造、拒绝向限制低头",
    shadow: "可能太快奔向未来，遗漏当下的人",
    coreQuestion: "突破生命的边界",
    history: "超人类主义是现代思想运动，主张用科学技术减轻疾病、衰老和认知限制，并讨论人类可能的未来形态。",
    ideas: ["生物限制不必全部被当作不可改变的命运。", "增强技术需要同时考虑公平、风险、身份与权力。", "技术进步的目标，应由关于何为好生活的讨论引导。"],
    misconception: "它不只是“变成机器人”，也不是默认所有新技术都值得接受。",
    thinkers: "朱利安·赫胥黎、尼克·博斯特罗姆，以及当代生命伦理学与未来研究",
    reflection: "如果能够升级自己，你最想改变什么，又绝不愿失去什么？",
  },
  simulationism: {
    name: "模拟论",
    english: "SIMULATION HYPOTHESIS",
    sigil: "镜像矩阵",
    motto: "现实也许是一层界面，但体验依然真实发生。",
    description: "你对现实的底层结构保持激进开放：数学秩序、信息宇宙与模拟假说，都可能是解释异常精确世界的钥匙。你着迷于边界之外的观察者，也知道尚无证据把可能性变成定论。",
    light: "开放、系统思维、敢问终极问题",
    shadow: "可能把不可证伪的想象当作出口",
    coreQuestion: "触碰现实的底层",
    history: "模拟论是一种当代形而上学假说：我们经验的现实，可能由更底层的信息或计算过程生成。它尚不是被证实的科学结论。",
    ideas: ["高度先进文明是否可能运行包含有意识主体的模拟？", "身处模拟中的规律，对内部观察者仍然构成现实。", "这一假说面临可检验性与无限回溯等难题。"],
    misconception: "它不是事实，也不能因为世界神秘就自动成立；目前更适合作为哲学推演。",
    thinkers: "尼克·博斯特罗姆的模拟论证；相关讨论连接信息哲学与数字物理学",
    reflection: "即使现实是一层界面，什么仍会对你的生活产生真实分量？",
  },
};

const philosophyKeys = Object.keys(profiles) as PhilosophyKey[];

const questions: Question[] = [
  { text: "人生没有预设剧本；我是谁，只能由一次次选择写出来。", constellation: "自由", weights: { existentialism: 2, determinism: -1, humanism: 0.5 } },
  { text: "即使宇宙永远沉默，人仍可以清醒、热烈，甚至带着幽默活下去。", constellation: "荒诞", weights: { absurdism: 2, nihilism: -0.5, existentialism: 0.5 } },
  { text: "真正重要的不是发生了什么，而是我如何判断并回应它。", constellation: "内在秩序", weights: { stoicism: 2, determinism: 0.5 } },
  { text: "比起强烈刺激，我更向往友谊、宁静和不被欲望追赶的生活。", constellation: "愉悦", weights: { epicureanism: 2, transhumanism: -0.5 } },
  { text: "没有神圣命令，人类的尊严与彼此的关怀依然足以成为伦理起点。", constellation: "尊严", weights: { humanism: 2, nihilism: -0.5 } },
  { text: "面对宏大的解释，我首先会问：它有什么证据，又如何可能被证明是错的？", constellation: "怀疑", weights: { skepticism: 2, naturalism: 1, simulationism: -0.5 } },
  { text: "意识不像物质的副产品；它也许是世界最基础的组成。", constellation: "意识", weights: { idealism: 2, naturalism: -1 } },
  { text: "爱、灵魂感与艺术再神秘，也终究发生在同一个自然世界里。", constellation: "自然", weights: { naturalism: 2, idealism: -1 } },
  { text: "如果知道一个人的全部基因、经历与环境，他的选择也许原则上可以被预测。", constellation: "因果", weights: { determinism: 2, existentialism: -1 } },
  { text: "所谓普遍价值更像人类的发明，而不是宇宙中客观存在的东西。", constellation: "虚无", weights: { nihilism: 2, humanism: -0.5, existentialism: 0.5 } },
  { text: "衰老、疾病和认知极限是工程问题，不是必须接受的神圣命运。", constellation: "进化", weights: { transhumanism: 2, stoicism: -0.5 } },
  { text: "高度数学化的宇宙，让我认真怀疑现实可能是某种计算或模拟。", constellation: "现实", weights: { simulationism: 2, naturalism: -0.5, skepticism: -0.5 } },
  { text: "我宁愿承担自由带来的焦虑，也不愿活成别人替我命名的角色。", constellation: "真实", weights: { existentialism: 2, stoicism: 0.5, determinism: -0.5 } },
  { text: "即使努力可能没有终点或保证，我仍愿意在清醒中继续生活与创造。", constellation: "反叛", weights: { absurdism: 2, nihilism: -0.5 } },
  { text: "我会主动区分可控与不可控，否则情绪就会把现实无限放大。", constellation: "边界", weights: { stoicism: 2, skepticism: 0.5 } },
  { text: "一个没有宏大成就、却有爱与安宁的人生，也可以是完整的人生。", constellation: "花园", weights: { epicureanism: 2, transhumanism: -0.5, humanism: 0.5 } },
  { text: "衡量一种制度或技术时，它是否减少真实的人类痛苦比它是否宏伟更重要。", constellation: "共同体", weights: { humanism: 2, transhumanism: 0.5 } },
  { text: "承认‘我不知道’常常比迅速得到一个漂亮答案更接近智慧。", constellation: "未知", weights: { skepticism: 2, simulationism: -0.5, idealism: 0.5 } },
  { text: "梦、象征与主观体验不是噪音，它们可能揭示现实本身的结构。", constellation: "梦境", weights: { idealism: 2, naturalism: -0.5 } },
  { text: "如果某个说法永远无法观察、检验或产生差异，我很难把它当作知识。", constellation: "证据", weights: { naturalism: 2, skepticism: 1, idealism: -0.5 } },
  { text: "理解行为背后的原因，比单纯赞美或责怪一个人的‘意志’更重要。", constellation: "轨迹", weights: { determinism: 2, humanism: 0.5 } },
  { text: "当所有传统意义都被拆解，剩下的空白本身比虚假的安慰更诚实。", constellation: "深渊", weights: { nihilism: 2, absurdism: 0.5, humanism: -0.5 } },
  { text: "只要足够谨慎，AI、脑机接口或基因技术可以让意识抵达全新的形态。", constellation: "未来", weights: { transhumanism: 2, naturalism: 0.5 } },
  { text: "即便世界是模拟，痛苦、爱与选择对身处其中的意识仍然具有分量。", constellation: "界面", weights: { simulationism: 2, humanism: 0.5, nihilism: -0.5 } },
];

const answerOptions = [
  { value: 0, label: "完全不认同", mark: "Ⅰ" },
  { value: 1, label: "不太认同", mark: "Ⅱ" },
  { value: 2, label: "难以决定", mark: "Ⅲ" },
  { value: 3, label: "比较认同", mark: "Ⅳ" },
  { value: 4, label: "非常认同", mark: "Ⅴ" },
];

function calculateScores(answers: number[]) {
  const raw = Object.fromEntries(philosophyKeys.map((key) => [key, 0])) as Record<PhilosophyKey, number>;
  const ranges = Object.fromEntries(philosophyKeys.map((key) => [key, 0])) as Record<PhilosophyKey, number>;

  questions.forEach((question, index) => {
    const centered = (answers[index] ?? 2) - 2;
    philosophyKeys.forEach((key) => {
      const weight = question.weights[key] ?? 0;
      raw[key] += centered * weight;
      ranges[key] += Math.abs(weight) * 2;
    });
  });

  return philosophyKeys
    .map((key) => ({
      key,
      score: Math.max(6, Math.min(94, Math.round(50 + (raw[key] / Math.max(ranges[key], 1)) * 44))),
    }))
    .sort((a, b) => b.score - a.score);
}

function CrystalHeart({ small = false }: { small?: boolean }) {
  return (
    <div className={small ? "heart-wrap heart-wrap--small" : "heart-wrap"} aria-hidden="true">
      <div className="orbit orbit--one"><i /></div>
      <div className="orbit orbit--two"><i /></div>
      <div className="crystal-heart">
        <span className="heart-shine" />
        <span className="heart-wire heart-wire--one" />
        <span className="heart-wire heart-wire--two" />
      </div>
      <div className="heart-halo" />
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shareLabel, setShareLabel] = useState("复制我的意识坐标");

  useEffect(() => {
    const saved = window.localStorage.getItem("nova-philosophy-oracle");
    if (!saved) return;
    let frame = 0;
    try {
      const parsed = JSON.parse(saved) as { answers?: number[]; current?: number };
      if (parsed.answers?.length && parsed.answers.length < questions.length) {
        frame = window.requestAnimationFrame(() => {
          setAnswers(parsed.answers ?? []);
          setCurrent(Math.min(parsed.current ?? parsed.answers?.length ?? 0, questions.length - 1));
        });
      }
    } catch {
      window.localStorage.removeItem("nova-philosophy-oracle");
    }
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (phase === "quiz") {
      window.localStorage.setItem("nova-philosophy-oracle", JSON.stringify({ answers, current }));
    }
  }, [answers, current, phase]);

  const scores = useMemo(() => calculateScores(answers), [answers]);
  const primary = scores[0];
  const secondary = scores[1];
  const profile = profiles[primary.key];
  const secondaryProfile = profiles[secondary.key];
  const progress = phase === "quiz" ? ((current + 1) / questions.length) * 100 : 0;

  const begin = () => {
    setAnswers([]);
    setCurrent(0);
    setPhase("quiz");
    setShareLabel("复制我的意识坐标");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const continueSaved = () => {
    setPhase("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const answer = (value: number) => {
    if (isTransitioning) return;
    const nextAnswers = [...answers];
    nextAnswers[current] = value;
    setAnswers(nextAnswers);
    setIsTransitioning(true);
    window.setTimeout(() => {
      if (current === questions.length - 1) {
        window.localStorage.removeItem("nova-philosophy-oracle");
        setPhase("result");
      } else {
        setCurrent((valueNow) => valueNow + 1);
      }
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 260);
  };

  const goBack = () => {
    if (current === 0) {
      setPhase("intro");
      return;
    }
    setCurrent((value) => value - 1);
  };

  const shareResult = async () => {
    const text = `我的哲学主星是「${profile.name}」${profile.sigil}，副星是「${secondaryProfile.name}」。\n${profile.motto}\n—— 意识坐标 · NOVA CRYSTAL`;
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=crystal`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "我的哲学意识坐标", text, url: shareUrl });
        setShareLabel("坐标已发送到宇宙");
      } else {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
        setShareLabel("已复制到剪贴板");
      }
    } catch {
      setShareLabel("复制未完成，再点一次");
    }
  };

  return (
    <main className="cosmos-shell">
      <div className="starfield" aria-hidden="true" />
      <div className="nebula nebula--rose" aria-hidden="true" />
      <div className="nebula nebula--cyan" aria-hidden="true" />
      <div className="pearl-thread pearl-thread--left" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="pearl-thread pearl-thread--right" aria-hidden="true"><i /><i /><i /><i /></div>

      <header className="site-header">
        <button className="brand" onClick={() => setPhase("intro")} aria-label="回到首页">
          <span className="brand-gem" />
          <span>NOVA CRYSTAL</span>
        </button>
        <div className="header-meta">
          <span>PHILOSOPHICAL ORACLE</span>
          <span className="header-star">✦</span>
          <span>CN · 2026</span>
        </div>
      </header>

      {phase === "intro" && (
        <section className="intro-stage page-enter">
          <div className="intro-copy">
            <div className="eyebrow"><span /> 不是标签，是一张意识星图</div>
            <h1>
              你是哪种<br />
              <em>哲学主义？</em>
            </h1>
            <p className="intro-lead">
              24 个命题，穿过自由、荒诞、意识、因果与现实的底层。看看你最接近哪一种思想坐标，以及它如何影响你理解世界。
            </p>
            <div className="intro-actions">
              <button className="primary-button" onClick={begin}>
                <span>进入意识轨道</span><b>↗</b>
              </button>
              {answers.length > 0 && answers.length < questions.length && (
                <button className="text-button" onClick={continueSaved}>继续上次的第 {current + 1} 题</button>
              )}
            </div>
            <div className="intro-notes">
              <span>约 4 分钟</span><i />
              <span>12 种思想坐标</span><i />
              <span>结果可分享</span>
            </div>
          </div>

          <div className="intro-art">
            <div className="art-label art-label--top"><span>01</span> CONSCIOUSNESS</div>
            <CrystalHeart />
            <div className="art-label art-label--bottom">PRISMATIC NOIR ROSE <span>∞</span></div>
            <div className="crystal-rose crystal-rose--one"><i /><i /><i /><i /></div>
            <div className="crystal-rose crystal-rose--two"><i /><i /><i /><i /></div>
          </div>

          <div className="intro-footer">
            <p>“人生也许没有一张埋在宇宙深处、等待聪明人解开的答卷。”</p>
            <span>SCROLL TO BEGIN · 向内凝视</span>
          </div>
        </section>
      )}

      {phase === "quiz" && (
        <section className="quiz-stage page-enter">
          <div className="progress-rail"><span style={{ width: `${progress}%` }} /></div>
          <div className="quiz-topline">
            <button className="back-button" onClick={goBack}>← 返回</button>
            <p><span>{String(current + 1).padStart(2, "0")}</span> / {questions.length}</p>
            <p className="constellation-name">坐标 · {questions[current].constellation}</p>
          </div>

          <div className={isTransitioning ? "question-card question-card--leaving" : "question-card"}>
            <div className="question-glyph" aria-hidden="true">
              <span className="glyph-ring" />
              <b>{String(current + 1).padStart(2, "0")}</b>
            </div>
            <p className="question-kicker">请凭第一直觉回答</p>
            <h2>{questions[current].text}</h2>
            <div className="answer-grid" role="group" aria-label="选择认同程度">
              {answerOptions.map((option) => (
                <button
                  key={option.value}
                  className={answers[current] === option.value ? "answer-option answer-option--selected" : "answer-option"}
                  onClick={() => answer(option.value)}
                  disabled={isTransitioning}
                >
                  <span className="answer-mark">{option.mark}</span>
                  <span>{option.label}</span>
                  <i />
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-footnote">
            <span>没有“正确答案”</span>
            <p>你的结果描述的是此刻的思想引力，而不是永恒身份。</p>
          </div>
        </section>
      )}

      {phase === "result" && (
        <section className="result-stage page-enter">
          <div className="result-hero">
            <div className="result-orbit">
              <span className="result-number">{primary.score}<small>%</small></span>
              <CrystalHeart small />
            </div>
            <div className="result-title">
              <div className="eyebrow"><span /> 你的哲学主星</div>
              <p className="result-english">{profile.english}</p>
              <h1>{profile.name}</h1>
              <div className="result-sigil">{profile.sigil}</div>
              <blockquote>{profile.motto}</blockquote>
            </div>
          </div>

          <div className="result-grid">
            <article className="glass-panel result-reading">
              <span className="panel-index">01 · ORACLE READING</span>
              <h2>你的意识如何面对世界</h2>
              <p>{profile.description}</p>
              <div className="duality">
                <div><span>光面</span><p>{profile.light}</p></div>
                <div><span>暗面</span><p>{profile.shadow}</p></div>
              </div>
            </article>

            <article className="glass-panel constellation-panel">
              <span className="panel-index">02 · CONSTELLATION</span>
              <h2>思想引力排行</h2>
              <div className="score-list">
                {scores.slice(0, 6).map((item, index) => (
                  <div className="score-row" key={item.key}>
                    <span className="score-rank">0{index + 1}</span>
                    <span className="score-name">{profiles[item.key].name}</span>
                    <span className="score-track"><i style={{ width: `${item.score}%` }} /></span>
                    <b>{item.score}</b>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-panel synthesis-panel">
              <span className="panel-index">03 · DUAL STAR</span>
              <p className="synthesis-label">主星 × 副星</p>
              <h2>{profile.name} <i>×</i> {secondaryProfile.name}</h2>
              <p>
                你以<strong>{profile.sigil}</strong>为核心，却也被<strong>{secondaryProfile.sigil}</strong>牵引。
                这意味着你既相信「{profile.motto.replace(/[。！？]/g, "")}」，也会用另一套坐标校准自己——矛盾不是故障，而是意识拥有纵深的证据。
              </p>
            </article>

            <article className="meaning-card">
              <span>你正在回应的核心命题</span>
              <h2>“{profile.coreQuestion}”</h2>
              <p>它没有唯一的标准答案。你每一次选择、创造和坚持，都在让属于你的答案逐渐成形。</p>
              <div className="meaning-glow" aria-hidden="true" />
            </article>
          </div>

          <section className="philosophy-atlas">
            <div className="atlas-header">
              <div>
                <span className="panel-index">04 · PHILOSOPHY ATLAS</span>
                <h2>十二种哲学坐标</h2>
              </div>
              <p>测试给出的是思想倾向，不是永久标签。展开任意一种，了解它真正关心的问题。</p>
            </div>

            <div className="atlas-list">
              {philosophyKeys.map((key, index) => {
                const item = profiles[key];
                return (
                  <details className={key === primary.key ? "atlas-item atlas-item--primary" : "atlas-item"} key={key} open={key === primary.key}>
                    <summary>
                      <span className="atlas-number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="atlas-name"><b>{item.name}</b><i>{item.english}</i></span>
                      {key === primary.key && <em>你的主星</em>}
                      <span className="atlas-toggle" aria-hidden="true">＋</span>
                    </summary>
                    <div className="atlas-content">
                      <div className="atlas-overview">
                        <span>它是什么</span>
                        <p>{item.history}</p>
                      </div>
                      <div>
                        <span>核心观点</span>
                        <ul>{item.ideas.map((idea) => <li key={idea}>{idea}</li>)}</ul>
                      </div>
                      <div>
                        <span>常见误解</span>
                        <p>{item.misconception}</p>
                      </div>
                      <div>
                        <span>代表思想家与传统</span>
                        <p>{item.thinkers}</p>
                      </div>
                      <blockquote>{item.reflection}</blockquote>
                    </div>
                  </details>
                );
              })}
            </div>
          </section>

          <div className="result-actions">
            <button className="primary-button" onClick={shareResult}><span>{shareLabel}</span><b>✦</b></button>
            <button className="text-button" onClick={begin}>重新穿越一次</button>
          </div>

          <footer className="result-footer">
            <div><span className="brand-gem" /> NOVA CRYSTAL</div>
            <p>意义可以是暂定答案。你可以在成长中，一次又一次重写它。</p>
            <span>MADE FOR A RESTLESS CONSCIOUSNESS</span>
          </footer>
        </section>
      )}
    </main>
  );
}
