const MediaPreview = ({ url, type }) => {
  if (!url) return null;

  return (
    <div className="media-preview">
      {type?.startsWith("image/") ? (
        <img src={url} alt="Selected media preview" />
      ) : (
        <video src={url} controls />
      )}
    </div>
  );
};

export default MediaPreview;
