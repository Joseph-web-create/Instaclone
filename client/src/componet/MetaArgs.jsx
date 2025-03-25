import { Helmet } from "react-helmet-async";

function MetaArgs({ title, content }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={content} />
    </Helmet>
  );
}

export default MetaArgs;
