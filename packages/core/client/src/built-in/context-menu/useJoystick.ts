import { useEffect } from 'react';

export const useJoystick = (ref) => {
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    /**
     * 摇杆配置
     */
    const config = {
      /** 摇杆半径 */
      radius: 100,
    };

    /**
     * 摇杆区域元素，摇杆只会渲染在该区域
     */
    const ele = ref.current;

    /** 是否正在按压 */
    let pressing = false;

    /** 初始X坐标 */
    let prevX = 0;
    /** 初始Y坐标 */
    let prevY = 0;

    /** 当前X坐标 */
    let newX = 0;
    /** 当前Y坐标 */
    let newY = 0;

    /** 相对X坐标 */
    let relX = 0;
    /** 相对Y坐标 */
    let relY = 0;

    /** 摇杆canvas移动后应在的X坐标 */
    let moveX = 0;
    /** 摇杆canvas移动后应在的Y坐标 */
    let moveY = 0;

    /** 根据半径限制相对坐标后的X坐标 */
    let displayX = 0;
    /** 根据半径限制相对坐标后的Y坐标 */
    let displayY = 0;

    ele.addEventListener('mousedown', down);
    ele.addEventListener('mousemove', move);
    ele.addEventListener('mouseup', up);

    ele.addEventListener('touchstart', down);
    ele.addEventListener('touchmove', move);
    ele.addEventListener('touchend', up);

    const stickEle = createStickCanvas();
    const baseEle = createBaseCanvas();

    // ele.style.position = 'fixed';
    ele.appendChild(baseEle);
    baseEle.style.position = 'absolute';
    baseEle.style.visibility = 'hidden';
    ele.appendChild(stickEle);
    stickEle.style.position = 'absolute';
    stickEle.style.visibility = 'hidden';

    /**
     * 按压或鼠标点击后渲染摇杆
     * @param  {} event TouchEvent | MouseEvent
     */
    function down(event: MouseEvent) {
      if (event.buttons === 1) {
        console.log('🚀 ~ file: ContextMenu.provider.tsx:81 ~ down ~ event:', event);
        pressing = true;
        prevX = getClientPosition(event).x;
        prevY = getClientPosition(event).y;
        baseEle.style.visibility = 'visible';
        stickEle.style.visibility = 'visible';
        stickMove(stickEle.style, prevX - stickEle.width / 2, prevY - stickEle.height / 2);
        stickMove(baseEle.style, prevX - baseEle.width / 2, prevY - baseEle.height / 2);
      }
    }

    /**
     * 取消按压或松开鼠标后隐藏摇杆，并重置display坐标
     * @param  {} event TouchEvent | MouseEvent
     */
    function up(event) {
      pressing = false;
      baseEle.style.visibility = 'hidden';
      stickEle.style.visibility = 'hidden';
      displayX = 0;
      displayY = 0;
    }

    function moveTable(relX: number, relY: number) {
      const tables = document.querySelectorAll('.ant-table-content');
      const main = document.querySelector('main');
      tables.forEach((table) => {
        table.scrollBy(relX * 10, 0);
      });
      main.scrollBy(0, relY * 10 * -1);
    }

    let moveRelX = 0;
    let moveRelY = 0;

    const timerId = setInterval(() => {
      if (pressing) {
        moveTable(moveRelX, moveRelY);
      }
    }, 16);

    /**
     * 移动鼠标响应事件，根据移动坐标计算相对坐标以及需要渲染的坐标，
     * 并根据半径限制距离，对计算后的值进行四舍五入
     * @param  {} event TouchEvent | MouseEvent
     */
    function move(event) {
      if (pressing) {
        newX = getClientPosition(event).x;
        newY = getClientPosition(event).y;
        relX = newX - prevX;
        relY = prevY - newY;
        const distance = Math.sqrt(Math.pow(relX, 2) + Math.pow(relY, 2));
        const stickNormalizedX = relX / distance;
        const stickNormalizedY = relY / distance;
        moveRelX = stickNormalizedX;
        moveRelY = stickNormalizedY;
        // moveTable(stickNormalizedX, stickNormalizedY);
        if (distance <= config.radius) {
          moveX = newX - stickEle.width / 2;
          moveY = newY - stickEle.height / 2;
          stickMove(stickEle.style, moveX, moveY);
        } else {
          moveX = stickNormalizedX * config.radius + prevX - stickEle.width / 2;
          moveY = -stickNormalizedY * config.radius + prevY - stickEle.height / 2;
          stickMove(stickEle.style, moveX, moveY);
        }
        displayX = Math.round(stickNormalizedX * config.radius);
        displayY = Math.round(stickNormalizedY * config.radius);
      }
    }

    /**
     * 创建摇杆canvas
     */
    function createStickCanvas() {
      const canvas = document.createElement('canvas');
      canvas.width = 86;
      canvas.height = 86;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.lineWidth = 6;
      ctx.arc(canvas.width / 2, canvas.width / 2, 40, 0, Math.PI * 2, true);
      ctx.stroke();
      return canvas;
    }
    /**
     * 创建摇杆底座canvas
     */
    function createBaseCanvas() {
      const canvas = document.createElement('canvas');
      canvas.width = 126;
      canvas.height = 126;

      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.lineWidth = 6;
      ctx.arc(canvas.width / 2, canvas.width / 2, 40, 0, Math.PI * 2, true);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(canvas.width / 2, canvas.width / 2, 60, 0, Math.PI * 2, true);
      ctx.stroke();

      return canvas;
    }
    /**
     * 移动摇杆
     * @param  {} style 传入摇杆底座/摇杆的style属性
     * @param  {} x x轴移动距离
     * @param  {} y y轴移动距离
     * @example stickMove(stickEle.style, (prevX - stickEle.width/2), (prevY - stickEle.height/2));
     */
    function stickMove(style, x, y) {
      const transform = supportTransform();
      if (transform) {
        style[transform] = 'translate(' + x + 'px,' + y + 'px)';
      } else {
        style.left = x + 'px';
        style.top = y + 'px';
      }
    }

    /**
     * 查看是否支持translate
     */
    function supportTransform() {
      const styles = ['webkitTransform', 'MozTransform', 'msTransform', 'OTransform', 'transform'];

      const el = document.createElement('p');
      let style;

      for (let i = 0; i < styles.length; i++) {
        style = styles[i];
        if (null != el.style[style]) {
          return style;
        }
      }
    }

    /**
     * 获取client坐标，不同的响应对象取值方法不同
     * @param  {} event TouchEvent | MouseEvent
     */
    function getClientPosition(event) {
      if (event instanceof TouchEvent) {
        return {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      } else {
        return {
          x: event.clientX,
          y: event.clientY,
        };
      }
    }

    return () => {
      clearInterval(timerId);
    };
  });
};
