"use client";

import { Fragment } from "react";
import { useLanguage } from "./i18n/LanguageProvider";
import structure from "./content/profile-structure.json";
import { InterestIllustration } from "./InterestIllustration";

type Block = { type: string; key?: string; items?: string[]; rows?: string[][]; blocks?: Block[] };
type Section = { title: string; blocks: Block[] };
export const profile = structure as { sections: Record<string, Section>; closing: string; tagline: string };

function Inline({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https:\/\/[^)\s]+\))/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong dir="auto" key={index}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\((https:\/\/[^)\s]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    return <Fragment key={index}>{part}</Fragment>;
  })}</>;
}

export function ProfileBlocks({ blocks, revealItems = false }: { blocks: Block[]; revealItems?: boolean }) {
  const { t } = useLanguage();
  return <>{blocks.map((block, index) => {
    const id = block.key ?? block.items?.[0] ?? block.rows?.[0]?.[0] ?? String(index);
    if (block.type === "heading") return <h3 key={id}><Inline text={t(block.key!)} /></h3>;
    if (block.type === "subheading") return <h3 className="profile-subheading" key={id}><Inline text={t(block.key!)} /></h3>;
    if (block.type === "paragraph") return <Fragment key={id}>{t(block.key!).split("\n\n").map((paragraph, paragraphIndex) => <Fragment key={paragraphIndex}>
      {paragraphIndex > 0 ? "\n\n" : null}
      {block.key === "p140" && paragraphIndex === 1 ?
        <blockquote className="stargazing-quote" dir="auto"><Inline text={paragraph} /></blockquote> :
        <p className="profile-copy" dir="auto"><Inline text={paragraph} /></p>}
    </Fragment>)}</Fragment>;
    if (block.type === "details" && block.key === "p153") return <details className="profile-fold game-fold" key={id}>
      <summary data-reveal="line"><span>{t(block.key)}</span><span className="profile-fold__mark" aria-hidden="true" /></summary>
      <div className="game-groups">{block.blocks!.filter(item => item.type === "subheading").map((item, i) => <div className="game-group" key={item.key}>
        <h4><Inline text={t(item.key!)} /></h4>
        <p dir="auto">{t(block.blocks![i * 2 + 1].key!).split(" · ").map((title, titleIndex) => <Fragment key={title}>
          {titleIndex > 0 ? " · " : null}<span className="game-title">{title}</span>
        </Fragment>)}</p>
      </div>)}</div>
    </details>;
    if (block.type === "details") return <details className="profile-fold" key={id}>
      <summary data-reveal="line"><span><Inline text={t(block.key!)} /></span><span className="profile-fold__mark" aria-hidden="true" /></summary>
      <div className="profile-fold__body"><ProfileBlocks blocks={block.blocks!} /></div>
    </details>;
    if (block.type === "list" && block.items?.[0] === "p127") return <nav className="resource-list" aria-label={t("s093")} key={id}>
      {block.items.map((item, i) => {
        const link = t(item).match(/^\[([^\]]+)\]\((https:\/\/[^)\s]+)\)$/);
        if (!link) return null;
        return <a key={item} href={link[2]} target="_blank" rel="noreferrer" data-reveal="line">
          <i className="resource-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</i>
          <strong>{link[1]}</strong><span>{t(`s${String(49 + i).padStart(3, "0")}`)}</span>
          <span className="resource-action" aria-hidden="true">{t("s094")}</span>
        </a>;
      })}
    </nav>;
    if (block.type === "list") return <ul className="profile-list" key={id}>{block.items!.map(item => <li dir="auto" key={item} data-reveal={revealItems ? "line" : undefined}><Inline text={t(item)} /></li>)}</ul>;
    if (block.type === "table") return <div className="profile-table-wrap" key={id}><table className="profile-table">
      <thead><tr>{block.rows![0].map(cell => <th scope="col" key={cell}><Inline text={t(cell)} /></th>)}</tr></thead>
      <tbody>{block.rows!.slice(1).map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}><Inline text={t(cell)} /></td>)}</tr>)}</tbody>
    </table></div>;
    return null;
  })}</>;
}

export function ProfileContent({ section, layout = "plain" }: { section: string; layout?: "plain" | "rows" | "folds" | "grid" }) {
  const { t } = useLanguage();
  const blocks = profile.sections[section].blocks;
  if (layout === "plain") return <div className="profile-content"><ProfileBlocks blocks={blocks} /></div>;
  const preamble: Block[] = [];
  const groups: { key: string; blocks: Block[] }[] = [];
  for (const block of blocks) {
    if (block.type === "heading") groups.push({ key: block.key!, blocks: [] });
    else (groups.length ? groups[groups.length - 1].blocks : preamble).push(block);
  }
  return <div className={`profile-content profile-content--${layout}`}>
    {preamble.length > 0 && <div className="profile-preamble"><ProfileBlocks blocks={preamble} /></div>}
    <div className={`profile-groups profile-groups--${layout}`}>{groups.map(group => layout === "folds" ?
      <details className="profile-fold" key={group.key}>
        <summary data-reveal="line"><span>{t(group.key)}</span><span className="profile-fold__mark" aria-hidden="true" /></summary>
        <div className="profile-fold__body"><ProfileBlocks blocks={group.blocks} /></div>
      </details> :
      <article className={group.key === "p021" ? "profile-plans" : "profile-row"} key={group.key} data-profile-group={group.key} data-reveal={group.key === "p021" ? undefined : "line"}>
        {section === "interests" && <InterestIllustration kind={group.key} />}
        <h3>{t(group.key)}</h3><div><ProfileBlocks blocks={group.blocks} revealItems={group.key === "p021"} /></div>
      </article>
    )}</div>
  </div>;
}
