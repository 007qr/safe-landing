import { onMount } from "solid-js";
import QRCode from "qrcode";

export default function QRCodeCanvas(props: { text: string }) {
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (canvasRef) {
      QRCode.toCanvas(canvasRef, props.text, { width: 150 }, function (error) {
        if (error) console.error(error);
      });
    }
  });

  return <canvas ref={canvasRef!} width="150px" height="150px" />;
}
