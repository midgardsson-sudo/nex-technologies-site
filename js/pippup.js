'use strict';

(function () {
      var guide = document.querySelector("[data-pippup-guide]");
      if (!guide) return;

      var toggle = guide.querySelector("[data-pippup-toggle]");
      var close = guide.querySelector("[data-pippup-close]");
      var title = guide.querySelector("#pippup-title");
      var status = guide.querySelector("[data-pippup-status]");
      var actionLinks = guide.querySelectorAll(".pippup-actions a, .pippup-community-link");
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      var canFollowCursor = window.matchMedia("(hover: hover) and (pointer: fine)");
      var pippupConfig = {
        page: "home",
        headings: {
          home: ["Welcome to YewForge!", "Need a paw finding the right forge?"],
          workshop: ["Building something new?", "Need a paw finding the right forge?"],
          forgeLog: ["Fancy seeing what we&rsquo;ve been forging?", "Need a paw finding the right forge?"],
          communityForge: ["This month&rsquo;s community spotlight is ready!", "Need a paw finding the right forge?"],
          laboratory: ["Some experiments escaped the workshop...", "Need a paw finding the right forge?"]
        }
      };
      var statuses = [
        "Keeping the forge warm",
        "Watching the Workshop",
        "Reading the Forge Log",
        "Guarding the Community Forge",
        "Waiting for the next project",
        "Exploring the Campus"
      ];

      if (status) {
        status.textContent = statuses[Math.floor(Math.random() * statuses.length)];
      }

      if (title && pippupConfig.page && pippupConfig.page !== "home" && pippupConfig.headings[pippupConfig.page]) {
        title.innerHTML = "<strong>" + pippupConfig.headings[pippupConfig.page][0] + "</strong><span>" + pippupConfig.headings[pippupConfig.page][1] + "</span>";
      }

      function canUseIdleMotion() {
        return !reduceMotion.matches && canFollowCursor.matches;
      }

      var sitTimer = null;
      function clearSit() {
        guide.classList.remove("is-sitting");
      }

      function scheduleSit() {
        if (sitTimer) window.clearTimeout(sitTimer);
        if (!canUseIdleMotion()) return;
        sitTimer = window.setTimeout(function () {
          guide.classList.add("is-sitting");
          window.setTimeout(clearSit, 3200);
          scheduleSit();
        }, 10000 + Math.floor(Math.random() * 10000));
      }

      function wakePipPup() {
        clearSit();
        scheduleSit();
      }

      scheduleSit();

      function setOpen(isOpen) {
        wakePipPup();
        guide.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Minimise PipPup guide" : "Open PipPup guide");
      }

      toggle.addEventListener("click", function () {
        setOpen(!guide.classList.contains("is-open"));
      });

      close.addEventListener("click", function () {
        setOpen(false);
        toggle.focus();
      });

      Array.prototype.forEach.call(actionLinks, function (link) {
        link.addEventListener("pointerenter", function () {
          wakePipPup();
          if (!reduceMotion.matches) guide.classList.add("is-attending");
        });
        link.addEventListener("pointerleave", function () {
          guide.classList.remove("is-attending");
        });
        link.addEventListener("focus", function () {
          wakePipPup();
          if (!reduceMotion.matches) guide.classList.add("is-attending");
        });
        link.addEventListener("blur", function () {
          guide.classList.remove("is-attending");
        });
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && guide.classList.contains("is-open")) {
          setOpen(false);
          toggle.focus();
        }
      });

      document.addEventListener("focusin", function (event) {
        var target = event.target;
        if (!target || guide.contains(target)) return;
        if (target.matches && target.matches("input, textarea, select, button")) {
          setOpen(false);
        }
      });

      document.addEventListener("pointermove", function (event) {
        if (!canFollowCursor.matches || reduceMotion.matches) return;
        wakePipPup();

        var rect = toggle.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var distanceX = Math.max(-1, Math.min(1, (event.clientX - centerX) / 260));
        var distanceY = Math.max(-1, Math.min(1, (event.clientY - centerY) / 220));

        guide.style.setProperty("--pippup-eye-x", (distanceX * 0.45).toFixed(2) + "px");
        guide.style.setProperty("--pippup-eye-y", (distanceY * 0.3).toFixed(2) + "px");
        guide.style.setProperty("--pippup-head-x", (distanceX * 0.8).toFixed(2) + "deg");
        guide.style.setProperty("--pippup-head-y", (distanceY * -0.45).toFixed(2) + "deg");
      }, { passive: true });

      document.addEventListener("pointerleave", function () {
        guide.style.setProperty("--pippup-eye-x", "0px");
        guide.style.setProperty("--pippup-eye-y", "0px");
        guide.style.setProperty("--pippup-head-x", "0deg");
        guide.style.setProperty("--pippup-head-y", "0deg");
      });
    })();
