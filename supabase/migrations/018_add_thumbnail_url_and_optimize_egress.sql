-- Migration 018: Add thumbnail_url column and backfill extracted thumbnails to drop database egress by 99%

-- 1. Add column
ALTER TABLE public.mods ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- 2. Backfill existing thumbnails
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/affaan-m/ECC/HEAD/assets/images/guides/shorthand-guide.png' WHERE id = '41b97d8f-2319-4779-8efe-2ff03fbeb929';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/ruvnet/ruflo/HEAD/ruflo-plugins.gif' WHERE id = '7f452bfb-28ce-4f4b-a955-671f4d09cdab';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/hesreallyhim/awesome-claude-code/HEAD/assets/update-in-progress-light-2.svg' WHERE id = '6ccaae57-6d5c-4899-b87e-266cdf26e0af';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/upstash/context7/master/public/cover.png?raw=true' WHERE id = 'a0a3f558-c27b-4e7a-9389-6290f52109ff';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/Leonxlnx/taste-skill/HEAD/examples/floria-top.webp' WHERE id = 'ac452f4c-6a97-4b8a-bc7e-e47ad0f768e3';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/klavis-ai/klavis/main/static/klavis-ai.png' WHERE id = 'e893bbfb-d9ed-4310-8c08-c0d85c7d47c1';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/55b97c47-8506-4be0-b18f-f5384d063cbb' WHERE id = 'd46e063e-17f2-4c9c-95ce-82f20115e8b1';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/steipete/claude-code-mcp/HEAD/assets/screenshot.png' WHERE id = '457652ce-f7bd-46be-bd9f-4f96c5e7cc58';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/07e63ac4-b67d-457b-9029-1dc5d860e920' WHERE id = '50cfc550-c963-410a-9735-37d3d79db891';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/27ef7269-0153-47c0-b07d-ed6a9504a176' WHERE id = '78464924-27fc-4de4-8cea-772a1cf104e2';
UPDATE public.mods SET thumbnail_url = 'https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=Claude%20Code%20Workflow&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=32&desc=Multi-Agent%20AI%20Development%20Framework&descAlignY=52&descSize=18' WHERE id = '057ac3e6-1a2f-48ef-8e7d-683191df8890';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/a978cb0a-785d-4a7d-aff2-7e962edd3120' WHERE id = '1652ba40-ab06-4192-a54c-3575b5df1387';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/Helmi/claude-simone/master/documentation/static/img/simone-logo-dark.png' WHERE id = '10c94771-8c4b-444b-b31f-ba9160c366f4';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/manzaltu/claude-code-ide.el/fb517ac3700f92f8d5481f0bcf9fe4a3c26c91ab/screenshots/file.png' WHERE id = '1d22e70e-3ce9-4cff-93c0-44dca4901825';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/ruvnet/sparc/HEAD/assets/sparc_cli.png.png' WHERE id = '1c8b3daa-ed5a-4967-916a-6c1cdff26ff8';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/pchalasani/claude-code-tools/HEAD/assets/card-quickstart.svg' WHERE id = '27926ea5-4174-431e-8f75-f3c950a2a20f';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/henkisdabro/Claude-Code-MCP-Server-Selector/HEAD/docs/demo.gif' WHERE id = '2ab6de25-e771-4850-b49a-08c42854e17b';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/danielrosehill/Claude-Slash-Commands/HEAD/ref/from-ai/command-graph.png' WHERE id = '41252899-58cb-4319-a390-ebed9e480f3d';
UPDATE public.mods SET thumbnail_url = 'https://sfquickstarts.s3.us-west-1.amazonaws.com/misc/mcp/Cursor.gif' WHERE id = '4b2fbc79-1e42-4a21-8b48-b0ef8763f0be';
UPDATE public.mods SET thumbnail_url = 'https://cdn.jsdelivr.net/gh/ccusage/ccusage@main/docs/public/screenshot.png' WHERE id = '610a7fca-fcc6-457a-9977-55a4494a1d73';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/github/github-mcp-server/HEAD/pkg/octicons/icons/workflow-light.png' WHERE id = '4f495970-9847-4895-bb5c-c88508440a92';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/b89524e4-6e6e-49e6-ba77-00d6df0c6e5c' WHERE id = '5e23107d-d6a7-4f23-9c02-e8e91085af61';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/karanb192/claude-code-hooks/HEAD/assets/block-secrets.png' WHERE id = '6745ff55-7579-45cc-a8ae-9bfd29663425';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/dbt-labs/dbt-mcp/refs/heads/main/docs/d2.png' WHERE id = '681ee2ec-394a-4e35-9c2c-e8b4175a987c';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/daymade/claude-code-skills/HEAD/demos/skill-creator/init-skill.gif' WHERE id = '8398dd87-8941-408c-90fb-85358a5997fa';
UPDATE public.mods SET thumbnail_url = 'https://user-images.githubusercontent.com/891664/227103090-6624bf7d-9524-4e05-9d2c-c28d5d451481.png' WHERE id = '8374b64a-7f30-42fc-89e4-07621454eb8e';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/tacticlaunch/mcp-linear/main/docs/linear-app-icon.png?raw=true' WHERE id = '7a2cc616-2990-42ab-85e2-8dc59de9275d';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/0db54cfc-f3dd-4683-abbb-e4c01d9dfb5d' WHERE id = '8bab50df-84d2-499d-b9ce-caded2bf257f';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/containers/kubernetes-mcp-server/HEAD/docs/images/vibe-coding.jpg' WHERE id = '5acb38a3-a695-4829-aeea-d1898d204870';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/e2b-dev/mcp-server/HEAD/readme-assets/mcp-server-light.png#gh-light-mode-only' WHERE id = '8d1842b4-40d3-481c-9810-dce75621e7a3';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/lodetomasi/agents-claude-code/HEAD/banner.svg' WHERE id = '94fc0785-6d2c-4a1f-a950-9c6dc8fa7a04';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/zilliztech/claude-context/HEAD/assets/claude-context.png' WHERE id = '8eb2415d-f888-4471-80f0-76d6ee56ca36';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/alexfazio/plankton/HEAD/assets/plankton-cover.png' WHERE id = 'a76810c0-bdc2-4309-b0e3-318b9944f8dd';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/3fce101a-b7d4-482f-9182-0be70ed1ad56' WHERE id = '8f94b935-82bc-4d4c-a71e-1ddaa8b21615';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/klavis-ai/klavis/main/static/klavis-ai.png' WHERE id = 'ab184367-d64f-464f-8a88-11ca3f99c9a4';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/eyaltoledano/claude-task-master/HEAD/images/logo.png?raw=true' WHERE id = 'adca62c5-3918-418a-aa4c-1926a6dcd380';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/luongnv89/claude-howto/HEAD/resources/logos/claude-howto-logo.svg' WHERE id = 'b066c4d9-e46b-45fd-872f-20b5bd798360';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/tomstagl/cctop/HEAD/brand/svg/cctop-lockup-vertical-light.svg' WHERE id = 'dfc08c7b-aa57-4933-b664-0fae8300b624';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/hashicorp/terraform-mcp-server/HEAD/public/images/Terraform-LogoMark_onDark.svg' WHERE id = 'ba168b76-8b77-43e1-9ed3-3bd87ace43cf';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/zippoxer/recall/HEAD/screenshot-dark.png' WHERE id = 'bbaa5c8b-3344-42c6-baf0-62b90283c89a';
UPDATE public.mods SET thumbnail_url = 'https://pc0o4oduww.ufs.sh/f/crfz5GypRfo0lI4924gMSJKLY6297aVP0zZpilXBvqTbDyrs' WHERE id = 'c19ce777-27aa-47f1-bed1-9dd0e84825f0';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/scasella/claude-flightdeck/HEAD/docs/media/demo.gif' WHERE id = 'ffd067ea-ccc7-4e82-a27c-ba92836010a0';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/oraios/serena/HEAD/resources/serena-logo.svg#gh-light-mode-only' WHERE id = 'c255edee-ce9d-4c01-a8c8-cfbc124ca514';
UPDATE public.mods SET thumbnail_url = 'https://vizra.ai/img/vizra-logo.svg' WHERE id = 'ca876441-4af3-4b0a-855a-254b5ccaf3ce';
UPDATE public.mods SET thumbnail_url = 'http://i.ytimg.com/vi/y9biAm_Fkqw/hqdefault.jpg' WHERE id = 'cabbad48-a6e7-4f65-b6eb-1935126f8349';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/disler/claude-code-hooks-multi-agent-observability/HEAD/images/AgentDataFlowV2.gif' WHERE id = 'd0bf0d6f-d19b-4f31-afde-bb43539d3838';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/joeyism/claude-code-config/HEAD/docs/Screenshot%20from%202026-01-04%2008-11-11.png' WHERE id = 'de82cee7-f7a6-44a8-a7ba-46b199e7c7c9';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/b3917553-6cf9-4264-bc7a-9b8b74df0a17' WHERE id = 'd7b81437-032f-4426-9838-5bd5e1016bab';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/grahama1970/claude-code-mcp-enhanced/HEAD/assets/claude_code_example_20250515.png' WHERE id = 'e2c535c5-a590-4490-a9fd-304cb69cd588';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/xuanji86/claude-statuspane/HEAD/assets/card.svg' WHERE id = '4f9d22a2-c7fe-4b4b-aa80-fc5b451cd3c0';
UPDATE public.mods SET thumbnail_url = 'https://block.github.io/goose/img/extension-install-dark.svg' WHERE id = 'ba4e9a80-ed86-42ff-8d16-3c3a37ab52ce';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/Maciek-roboblog/Claude-Code-Usage-Monitor/main/doc/scnew.png' WHERE id = 'e2852113-e7d5-4500-b4ab-a8862b73486b';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/Arunjay4213/claude-mods/HEAD/docs/demo.gif' WHERE id = '10aba71a-a58b-4bea-be91-7fb91c684edd';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/carlrannaberg/claudekit/HEAD/assets/banner.png' WHERE id = 'ea372cd7-ea79-4699-bd98-ebf3ad66005c';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/1d60c2e9-82ed-4ee5-b749-f9e021c85f4d' WHERE id = 'ece000ec-2b7f-4a98-b292-1718241bdde9';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/atlassian/atlassian-mcp-server/HEAD/images/atlassian_logo_brand_RGB.svg' WHERE id = '6b376519-4bd4-476d-b899-59e38e591547';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/smtg-ai/claude-squad/HEAD/assets/screenshot.png' WHERE id = 'f3f76aa4-bc08-4631-a224-1f3cf4536210';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/dyoshikawa/rulesync/HEAD/images/logo.jpg' WHERE id = 'f865b3de-1e39-4e7f-8ccc-023ae4c43fbb';
UPDATE public.mods SET thumbnail_url = 'https://mintlify.s3.us-west-1.amazonaws.com/brightdata/logo/light.svg' WHERE id = '07959d00-037f-4d04-a7ae-fc16186ac0a8';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/OneWave-AI/claude-code-mods/HEAD/screenshots/burn-meter.png' WHERE id = 'f5f34a61-8532-4fb2-8abd-5ddea42ba749';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/dagger/container-use/HEAD/docs/images/demo.gif' WHERE id = '9934cc6f-f8e3-439f-a623-9a3584bd0814';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/ColeMurray/claude-code-otel/HEAD/docs/images/cost-usage-analytics.png' WHERE id = '6554b383-2b74-47bb-ad5e-7e04e1330afc';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/Anerco/claude-code-effort-cycle/HEAD/demo.gif' WHERE id = '1df182c5-ab6b-450e-bbdb-84f4b14637fe';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/stevemolitor/claude-code.el/HEAD/images/demo.gif' WHERE id = 'b79b7ecc-e3ce-4b04-b140-2bd343ad3f59';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/digitalsamba/claude-code-video-toolkit/HEAD/assets/banner/toolkit-banner.gif' WHERE id = 'f8d42fde-a881-4330-8c37-d9be64d5e83d';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/stephenleo/cship/HEAD/docs/examples/cship.png' WHERE id = '391d3946-996c-4d35-8e0d-8b6ccd19f245';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/872e253f-23ce-43b3-983c-45f9d0f66100' WHERE id = '531107a8-9605-412e-a25e-51a47105bdd3';
UPDATE public.mods SET thumbnail_url = 'https://pbs.twimg.com/media/GSjaG6qXMAAw5fm?format=jpg&name=4096x4096' WHERE id = '33529aa8-9605-4bbf-b1ef-2bb7f1ac5eb6';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/PleasePrompto/notebooklm-skill/HEAD/images/example_notebookchat.png' WHERE id = '7d8c93b9-61c5-4b3d-8729-b79a354bf222';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/danielrosehill/Claude-Code-Linux-Desktop-Slash-Commands/HEAD/banner.png' WHERE id = 'ee8347aa-8c3b-402e-8822-e3052abf67fa';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/88f4dce1-c12b-493a-be8c-a3c418293ef4' WHERE id = '1422b53e-13c3-4e95-8bcf-c171dd5f097a';
UPDATE public.mods SET thumbnail_url = 'https://piebald.ai/screenshot-light.png' WHERE id = '6567a988-271c-48a2-a08a-f94f06b786a6';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/NeoLabHQ/context-engineering-kit/HEAD/docs/assets/context-engineering-kit-like.gif' WHERE id = 'c0d6a197-491b-4363-b681-c9372da4b09a';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/e3ff90a7-7801-48a9-b807-f7dd47f0d3d6' WHERE id = '41605fe7-add8-40b3-863b-0727e64b031e';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/korotovsky/slack-mcp-server/HEAD/images/feature-1.gif' WHERE id = '2e6e21f5-50b0-4123-9645-a39098f64fa3';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/composio-community/secure-openclaw/HEAD/assets/secure-openclaw.gif' WHERE id = '7e787162-b473-477b-973a-28bd28b6ae5d';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/czlonkowski/n8n-mcp/HEAD/docs/img/skills.png' WHERE id = 'bb9b740f-fd25-4117-8ecb-2421d2495a68';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/microsoft/azure-devops-mcp/HEAD/docs/media/start-mcp-server.gif' WHERE id = '51421e5f-85e8-4835-8ab8-f54dd3a53ce9';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/disler/claude-code-hooks-mastery/HEAD/images/SubAgentFlow.gif' WHERE id = '25fc7e94-5829-4bea-9cc8-cda8952d56b6';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/nizos/tdd-guard/HEAD/docs/assets/tdd-guard-demo.gif' WHERE id = '8e12ebd4-44c8-4e55-a9c8-600300673b82';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/firecrawl/firecrawl-mcp-server/main/img/fire.png' WHERE id = '29fe73ac-ca02-4f09-bc31-0d0d3183721c';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/anthropics/claude-code/HEAD/demo.gif' WHERE id = '24209893-c72f-449e-b63b-8e74d7df2745';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/anthropics/claude-code/HEAD/demo.gif' WHERE id = '4a445a54-fa9b-4948-84b1-4c3a686c46e4';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/Chachamaru127/claude-code-harness/HEAD/docs/images/claude-harness-logo-with-text.png' WHERE id = '772973ad-0b81-4d7a-9c69-82b41330efa1';
UPDATE public.mods SET thumbnail_url = 'https://img.youtube.com/vi/cYdwOD_-dQc/maxresdefault.jpg' WHERE id = '6fc7b6d4-631a-429b-bbf1-c5d92b3cfc9b';
UPDATE public.mods SET thumbnail_url = 'https://nimbalyst.com/nimbalyst-logo.svg' WHERE id = '919f2bb0-698d-4be3-b2c3-6960c544e8bb';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/greggh/claude-code.nvim/main/assets/claude-code.png?raw=true' WHERE id = 'a25f167b-8824-483a-8fa4-f96dc3d3421b';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/Doriandarko/claude-engineer/HEAD/ui.png' WHERE id = 'c7cd641d-328c-4bd2-a632-cd0a52c27467';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/e3617410-9b1c-4731-87b7-a3858800b737' WHERE id = '0963a376-c47e-4b5c-947b-7f4548fc46fc';
UPDATE public.mods SET thumbnail_url = 'https://github.com/user-attachments/assets/e91255af-e4ba-4d71-b1a8-bd081e8a234a' WHERE id = '5ab502e5-f46b-4bad-9193-4b53e9a95524';
UPDATE public.mods SET thumbnail_url = 'https://raw.githubusercontent.com/touwaeriol/claude-code-plus/HEAD/docs/screenshots/tool-calls-demo.png' WHERE id = 'b92acdc9-a84c-4b1b-b4f5-cf6fdab3b3fd';

-- 3. Update search_mods function to return thumbnail_url and exclude heavy long_description
DROP FUNCTION IF EXISTS search_mods(text, mod_category, text, integer, integer);

CREATE OR REPLACE FUNCTION search_mods(
  query       text default null,
  p_category  mod_category default null,
  p_sort      text default 'votes',
  p_limit     integer default 24,
  p_offset    integer default 0
)
RETURNS TABLE (
  id               uuid,
  slug             varchar,
  name             varchar,
  description      text,
  thumbnail_url    text,
  category         mod_category,
  github_url       text,
  author_github    varchar,
  author_name      varchar,
  tags             text[],
  vote_count       integer,
  github_stars     integer,
  is_featured      boolean,
  created_at       timestamptz,
  rank             float4
)
LANGUAGE sql STABLE AS $$
  SELECT
    m.id,
    m.slug,
    m.name,
    m.description,
    m.thumbnail_url,
    m.category,
    m.github_url,
    m.author_github,
    m.author_name,
    m.tags,
    m.vote_count,
    m.github_stars,
    m.is_featured,
    m.created_at,
    CASE
      WHEN query IS NOT NULL AND query != ''
        THEN ts_rank_cd(m.search_vector, websearch_to_tsquery('english', query))
      ELSE 0
    END::float4 AS rank
  FROM public.mods m
  WHERE
    m.status = 'approved'
    AND (p_category IS NULL OR m.category = p_category)
    AND (
      query IS NULL OR query = '' OR
      m.search_vector @@ websearch_to_tsquery('english', query) OR
      m.name ILIKE '%' || query || '%' OR
      m.description ILIKE '%' || query || '%'
    )
  ORDER BY
    CASE WHEN p_sort = 'stars' THEN m.github_stars END DESC NULLS LAST,
    CASE WHEN p_sort = 'votes' THEN m.vote_count END DESC,
    CASE WHEN p_sort = 'newest' THEN m.created_at END DESC,
    rank DESC,
    m.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
$$;
