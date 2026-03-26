export async function getServerSideProps({ res }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kvgarage.com";
  const content = `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`;

  res.setHeader("Content-Type", "text/plain");
  res.write(content);
  res.end();

  return {
    props: {},
  };
}

export default function RobotsTxt() {
  return null;
}
