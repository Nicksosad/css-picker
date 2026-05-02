(function () {
    let enabled = localStorage.getItem("cssPickerEnabled") === "true";

    // =========================
    // 悬浮球
    // =========================
    const ball = document.createElement("div");
    ball.innerText = "CSS";
    Object.assign(ball.style, {
        position: "fixed",
        right: "20px",
        bottom: "100px",
        width: "60px",
        height: "60px",
        background: enabled ? "red" : "rgba(0,0,0,0.6)",
        color: "#fff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        fontSize: "14px",
        userSelect: "none"
    });

    document.body.appendChild(ball);

    // =========================
    // 浮窗
    // =========================
    const panel = document.createElement("div");
    Object.assign(panel.style, {
        position: "fixed",
        left: "20px",
        bottom: "100px",
        maxWidth: "80%",
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        padding: "10px",
        borderRadius: "8px",
        zIndex: 99999,
        fontSize: "12px",
        display: "none",
        wordBreak: "break-all"
    });

    document.body.appendChild(panel);

    // =========================
    // 拖拽（iOS）
    // =========================
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    ball.addEventListener("touchstart", (e) => {
        isDragging = true;
        offsetX = e.touches[0].clientX - ball.offsetLeft;
        offsetY = e.touches[0].clientY - ball.offsetTop;
    });

    ball.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        ball.style.left = e.touches[0].clientX - offsetX + "px";
        ball.style.top = e.touches[0].clientY - offsetY + "px";
        ball.style.right = "auto";
        ball.style.bottom = "auto";
    });

    ball.addEventListener("touchend", () => {
        isDragging = false;
    });

    // =========================
    // 开关
    // =========================
    ball.addEventListener("click", () => {
        enabled = !enabled;
        localStorage.setItem("cssPickerEnabled", enabled);
        ball.style.background = enabled ? "red" : "rgba(0,0,0,0.6)";
    });

    // =========================
    // 高亮框
    // =========================
    let lastEl = null;

    function highlight(el) {
        if (lastEl) {
            lastEl.style.outline = "";
        }
        el.style.outline = "2px solid red";
        lastEl = el;
    }

    // =========================
    // 生成 selector
    // =========================
    function getSelector(el) {
        if (el.id) return "#" + el.id;

        let path = [];
        while (el && el.nodeType === 1) {
            let selector = el.nodeName.toLowerCase();

            if (el.className) {
                selector += "." + el.className.trim().replace(/\s+/g, ".");
            }

            path.unshift(selector);
            el = el.parentElement;
        }
        return path.join(" > ");
    }

    // =========================
    // 点击拾取
    // =========================
    document.addEventListener("click", function (e) {
        if (!enabled) return;

        e.preventDefault();
        e.stopPropagation();

        const el = e.target;

        highlight(el);

        const selector = getSelector(el);

        panel.innerHTML = `
            <div><b>Selector:</b></div>
            <div style="margin:5px 0;">${selector}</div>
            <button id="copyBtn">复制</button>
        `;

        panel.style.display = "block";

        document.getElementById("copyBtn").onclick = () => {
            navigator.clipboard.writeText(selector);
            panel.innerHTML += "<div style='color:lightgreen;'>已复制！</div>";
        };

    }, true);

})();
