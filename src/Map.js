import { useRef, useEffect } from "react";
import html2canvas from "html2canvas";

const Map = ({ setImage }) => {
  const mapRef = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);

    window.initMap = () => {
      new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 }, // San Francisco, CA
        zoom: 12,
        disableDefaultUI: true
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const takeScreenshot = () => {
    html2canvas(mapRef.current, { useCORS: true }).then((canvas) => {
      var cropLeft = 0;
      var cropTop = 0;
      var cropWidth = mapRef.current.offsetWidth;
      var cropHeight = mapRef.current.offsetHeight;
      var croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;
      croppedCanvas
        .getContext("2d")
        .drawImage(
          canvas,
          cropLeft,
          cropTop,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );
      setImage(croppedCanvas.toDataURL());
    });
  };

  return (
    <div>
      <div
        id="map"
        ref={mapRef}
        style={{ height: "400px", width: "400px" }}
      ></div>
      <button id="screenshot-btn" onClick={takeScreenshot}>Take Screenshot</button>
    </div>
  );
};

export default Map;
