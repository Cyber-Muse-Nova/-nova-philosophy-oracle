"use client";

import { useEffect, useMemo, useState } from "react";
import {
  philosophyKeys,
  questionCopy,
  questionWeights,
  ui,
  type CopyMode,
  type Language,
  type PhilosophyKey,
} from "./quiz-content";
import { zhProfiles } from "./profiles-zh";
import { enProfiles, frProfiles } from "./profiles-intl";

const profileSets = { en: enProfiles, zh: zhProfiles, fr: frProfiles };
const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "en", label: "EN" },
  { value: "zh", label: "中文" },
  { value: "fr", label: "FR" },
];
const answerMarks = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"];

function calculateScores(answers: number[]) {
  const raw = Object.fromEntries(philosophyKeys.map((key) => [key, 0])) as Record<PhilosophyKey, number>;
  const ranges = Object.fromEntries(philosophyKeys.map((key) => [key, 0])) as Record<PhilosophyKey, number>;

  questionWeights.forEach((weights, index) => {
    const centered = (answers[index] ?? 2) - 2;
    philosophyKeys.forEach((key) => {
      const weight = weights[key] ?? 0;
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

function LanguageSwitch({
  language,
  onChange,
}: {
  language: Language;
  onChange: (language: Language) => void;
}) {
  return (
    <div className="language-switch" role="group" aria-label="Language / 语言 / Langue">
      {languageOptions.map((option) => (
        <button
          key={option.value}
          className={language === option.value ? "language-chip language-chip--active" : "language-chip"}
          onClick={() => onChange(option.value)}
          aria-pressed={language === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ModeSwitch({
  language,
  mode,
  onChange,
  compact = false,
}: {
  language: Language;
  mode: CopyMode;
  onChange: (mode: CopyMode) => void;
  compact?: boolean;
}) {
  const t = ui[language];
  return (
    <div className={compact ? "mode-switch mode-switch--compact" : "mode-switch"} role="group" aria-label={t.versionLabel}>
      <button
        className={mode === "clear" ? "mode-card mode-card--active" : "mode-card"}
        onClick={() => onChange("clear")}
        aria-pressed={mode === "clear"}
      >
        <span>01</span>
        <b>{t.clearName}</b>
        {!compact && <small>{t.clearDesc}</small>}
      </button>
      <button
        className={mode === "academic" ? "mode-card mode-card--active" : "mode-card"}
        onClick={() => onChange("academic")}
        aria-pressed={mode === "academic"}
      >
        <span>02</span>
        <b>{t.academicName}</b>
        {!compact && <small>{t.academicDesc}</small>}
      </button>
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [language, setLanguage] = useState<Language>("en");
  const [mode, setMode] = useState<CopyMode>("clear");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shareLabel, setShareLabel] = useState(ui.en.share);

  const t = ui[language];
  const profiles = profileSets[language];
  const localizedQuestions = questionCopy[language][mode];
  const constellations = questionCopy[language].constellations;

  useEffect(() => {
    const saved = window.localStorage.getItem("nova-philosophy-oracle");
    if (!saved) return;
    let frame = 0;
    try {
      const parsed = JSON.parse(saved) as {
        answers?: number[];
        current?: number;
        language?: Language;
        mode?: CopyMode;
      };
      if (parsed.answers?.length && parsed.answers.length < questionWeights.length) {
        frame = window.requestAnimationFrame(() => {
          setAnswers(parsed.answers ?? []);
          setCurrent(Math.min(parsed.current ?? parsed.answers?.length ?? 0, questionWeights.length - 1));
          if (parsed.language && ["en", "zh", "fr"].includes(parsed.language)) setLanguage(parsed.language);
          if (parsed.mode && ["clear", "academic"].includes(parsed.mode)) setMode(parsed.mode);
        });
      }
    } catch {
      window.localStorage.removeItem("nova-philosophy-oracle");
    }
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    document.title =
      language === "zh"
        ? "意识坐标 · 你是哪种哲学主义？"
        : language === "fr"
          ? "Coordonnées de conscience · Quelle philosophie vous ressemble ?"
          : "Consciousness Coordinates · Which philosophy are you?";
    setShareLabel(t.share);
  }, [language, t]);

  useEffect(() => {
    if (phase === "quiz") {
      window.localStorage.setItem(
        "nova-philosophy-oracle",
        JSON.stringify({ answers, current, language, mode }),
      );
    }
  }, [answers, current, language, mode, phase]);

  const scores = useMemo(() => calculateScores(answers), [answers]);
  const primary = scores[0];
  const secondary = scores[1];
  const profile = profiles[primary.key];
  const secondaryProfile = profiles[secondary.key];
  const progress = phase === "quiz" ? ((current + 1) / questionWeights.length) * 100 : 0;

  const begin = () => {
    setAnswers([]);
    setCurrent(0);
    setPhase("quiz");
    setShareLabel(t.share);
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
      if (current === questionWeights.length - 1) {
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
    const text =
      language === "zh"
        ? `我的哲学主星是「${profile.name}」${profile.sigil}，副星是「${secondaryProfile.name}」。\n${profile.motto}\n—— 意识坐标 · NOVA CRYSTAL`
        : language === "fr"
          ? `Mon étoile philosophique principale est « ${profile.name} » — ${profile.sigil}. Mon étoile secondaire est « ${secondaryProfile.name} ».\n${profile.motto}\n— Coordonnées de conscience · NOVA CRYSTAL`
          : `My philosophical primary star is ${profile.name} — ${profile.sigil}. My secondary star is ${secondaryProfile.name}.\n${profile.motto}\n— Consciousness Coordinates · NOVA CRYSTAL`;
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=crystal`;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, text, url: shareUrl });
        setShareLabel(t.sent);
      } else {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
        setShareLabel(t.copied);
      }
    } catch {
      setShareLabel(t.retry);
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
        <button className="brand" onClick={() => setPhase("intro")} aria-label={t.home}>
          <span className="brand-gem" />
          <span>NOVA CRYSTAL</span>
        </button>
        <div className="header-controls">
          <div className="header-meta">
            <span>PHILOSOPHICAL ORACLE</span>
            <span className="header-star">✦</span>
            <span>{t.headerMeta}</span>
          </div>
          <LanguageSwitch language={language} onChange={setLanguage} />
        </div>
      </header>

      {phase === "intro" && (
        <section className="intro-stage page-enter">
          <div className="language-prompt">
            <span className="language-prompt-arrow">↑</span>
            <span>{t.languageHint}</span>
          </div>
          <div className="intro-copy">
            <div className="eyebrow"><span /> {t.eyebrow}</div>
            <h1>
              {t.titleA}<br />
              <em>{t.titleB}</em>
            </h1>
            <p className="intro-lead">{t.intro}</p>
            <div className="version-picker">
              <p>{t.versionLabel}</p>
              <ModeSwitch language={language} mode={mode} onChange={setMode} />
            </div>
            <div className="intro-actions">
              <button className="primary-button" onClick={begin}>
                <span>{t.start}</span><b>↗</b>
              </button>
              {answers.length > 0 && answers.length < questionWeights.length && (
                <button className="text-button" onClick={continueSaved}>{t.resume(current + 1)}</button>
              )}
            </div>
            <div className="intro-notes">
              <span>{t.minutes}</span><i />
              <span>{t.coordinates}</span><i />
              <span>{t.shareable}</span>
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
            <p>{t.quote}</p>
            <span>{t.scroll}</span>
          </div>
        </section>
      )}

      {phase === "quiz" && (
        <section className="quiz-stage page-enter">
          <div className="progress-rail"><span style={{ width: `${progress}%` }} /></div>
          <div className="quiz-mode-row">
            <ModeSwitch language={language} mode={mode} onChange={setMode} compact />
          </div>
          <div className="quiz-topline">
            <button className="back-button" onClick={goBack}>{t.back}</button>
            <p><span>{String(current + 1).padStart(2, "0")}</span> / {questionWeights.length}</p>
            <p className="constellation-name">{t.coordinate} · {constellations[current]}</p>
          </div>

          <div className={isTransitioning ? "question-card question-card--leaving" : "question-card"}>
            <div className="question-glyph" aria-hidden="true">
              <span className="glyph-ring" />
              <b>{String(current + 1).padStart(2, "0")}</b>
            </div>
            <p className="question-kicker">{t.instinct}</p>
            <h2>{localizedQuestions[current]}</h2>
            <div className="answer-grid" role="group" aria-label={t.answerAria}>
              {t.scale.map((label, value) => (
                <button
                  key={value}
                  className={answers[current] === value ? "answer-option answer-option--selected" : "answer-option"}
                  onClick={() => answer(value)}
                  disabled={isTransitioning}
                >
                  <span className="answer-mark">{answerMarks[value]}</span>
                  <span>{label}</span>
                  <i />
                </button>
              ))}
            </div>
          </div>

          <div className="quiz-footnote">
            <span>{t.noCorrect}</span>
            <p>{t.footnote}</p>
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
              <div className="eyebrow"><span /> {t.primary}</div>
              <p className="result-english">{profile.english}</p>
              <h1>{profile.name}</h1>
              <div className="result-sigil">{profile.sigil}</div>
              <blockquote>{profile.motto}</blockquote>
            </div>
          </div>

          <div className="result-grid">
            <article className="glass-panel result-reading">
              <span className="panel-index">01 · ORACLE READING</span>
              <h2>{t.readingTitle}</h2>
              <p>{profile.description}</p>
              <div className="duality">
                <div><span>{t.light}</span><p>{profile.light}</p></div>
                <div><span>{t.shadow}</span><p>{profile.shadow}</p></div>
              </div>
            </article>

            <article className="glass-panel constellation-panel">
              <span className="panel-index">02 · CONSTELLATION</span>
              <h2>{t.ranking}</h2>
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
              <p className="synthesis-label">{t.dual}</p>
              <h2>{profile.name} <i>×</i> {secondaryProfile.name}</h2>
              <p>{t.dualSentence(profile.sigil, secondaryProfile.sigil, profile.motto)}</p>
            </article>

            <article className="meaning-card">
              <span>{t.corePrompt}</span>
              <h2>“{profile.coreQuestion}”</h2>
              <p>{t.coreText}</p>
              <div className="meaning-glow" aria-hidden="true" />
            </article>
          </div>

          <section className="philosophy-atlas">
            <div className="atlas-header">
              <div>
                <span className="panel-index">04 · PHILOSOPHY ATLAS</span>
                <h2>{t.atlas}</h2>
              </div>
              <p>{t.atlasLead}</p>
            </div>

            <div className="atlas-list">
              {philosophyKeys.map((key, index) => {
                const item = profiles[key];
                return (
                  <details className={key === primary.key ? "atlas-item atlas-item--primary" : "atlas-item"} key={key} open={key === primary.key}>
                    <summary>
                      <span className="atlas-number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="atlas-name"><b>{item.name}</b><i>{item.english}</i></span>
                      {key === primary.key && <em>{t.yourPrimary}</em>}
                      <span className="atlas-toggle" aria-hidden="true">＋</span>
                    </summary>
                    <div className="atlas-content">
                      <div className="atlas-overview">
                        <span>{t.what}</span>
                        <p>{item.history}</p>
                      </div>
                      <div>
                        <span>{t.ideas}</span>
                        <ul>{item.ideas.map((idea) => <li key={idea}>{idea}</li>)}</ul>
                      </div>
                      <div>
                        <span>{t.misconception}</span>
                        <p>{item.misconception}</p>
                      </div>
                      <div>
                        <span>{t.thinkers}</span>
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
            <button className="text-button" onClick={begin}>{t.retake}</button>
          </div>

          <footer className="result-footer">
            <div><span className="brand-gem" /> NOVA CRYSTAL</div>
            <p>{t.footer}</p>
            <span>MADE FOR A RESTLESS CONSCIOUSNESS</span>
          </footer>
        </section>
      )}
    </main>
  );
}
