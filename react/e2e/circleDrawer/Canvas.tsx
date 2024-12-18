import {MouseEventHandler, useEffect, useRef} from "react";

const Canvas = ({
                    draw,
    onClick,
}: {
    draw: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void,
    onClick: MouseEventHandler<HTMLCanvasElement>
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            canvasCtxRef.current = canvasRef.current.getContext('2d');
            if (canvasCtxRef.current) {
                draw(canvasRef.current, canvasCtxRef.current);
            }
        }
    }, [draw])

    return (<canvas ref={canvasRef} id="canvas" onClick={onClick}></canvas>)
}

export default Canvas;
