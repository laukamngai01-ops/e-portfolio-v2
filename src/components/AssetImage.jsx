import { useState } from "react";
import { getAsset, imageSet, imageUrl } from "../data/portfolio";
import { useLanguage } from "../context/LanguageContext";
export default function AssetImage({
  id,
  alt,
  className,
  eager = false,
  sizes = "100vw",
}) {
  const [failed, setFailed] = useState(false);
  const { t } = useLanguage();
  const asset = getAsset(id);
  if (failed)
    return (
      <div className={"asset-error " + (className || "")} role="status">
        {t("Image unavailable", "影像暫時無法載入")}
      </div>
    );
  return (
    <img
      src={imageUrl(id)}
      srcSet={imageSet(id)}
      sizes={sizes}
      width={asset.width}
      height={asset.height}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
