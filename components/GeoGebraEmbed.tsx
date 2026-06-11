type Props = {
  readOnly?: boolean;
};

export default function GeoGebraEmbed({ readOnly = false }: Props) {
  const params = new URLSearchParams({ embed: "true" });
  if (readOnly) {
    params.set("showToolBar", "false");
    params.set("showAlgebraInput", "false");
    params.set("showMenuBar", "false");
  }

  return (
    <iframe
      src={`https://www.geogebra.org/geometry?${params.toString()}`}
      className="w-full h-full border-0 rounded"
      allowFullScreen
      title="GeoGebra Geometry"
    />
  );
}
