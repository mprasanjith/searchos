import Image from "next/image";
import { MediaComponent } from "searchpal";

const Media: MediaComponent = ({ img, label }) => {
  const letter = label.charAt(0).toUpperCase();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#13935e",
        background: "#e8fbf0",
      }}
    >
      {img ? (
        <Image src={img.src} alt="" style={{ width: "100%", height: "100%" }} />
      ) : (
        <span style={{ fontSize: ".8rem", fontWeight: 800 }}>{letter}</span>
      )}
    </div>
  );
};

export default Media;
