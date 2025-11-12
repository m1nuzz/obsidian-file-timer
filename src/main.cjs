"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
 return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

var main_exports = {};
__export(main_exports, {
  default: () => FileTimerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

function noop() {}
function run(fn) { return fn(); }
function run_all(fns) { fns.forEach(run); }
function is_function(thing) { return typeof thing === 'function'; }
function safe_not_equal(a, b) { return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function'); }
function blank_object() { return Object.create(null); }
function append(target, node) { target.appendChild(node); }
function insert(target, node, anchor) { target.insertBefore(node, anchor || null); }
function detach(node) { if (node.parentNode) { node.parentNode.removeChild(node); } }
function element(name) { return document.createElement(name); }
function text(data) { return document.createTextNode(data); }
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
var current_component;
function set_current_component(component) { current_component = component; }
var dirty_components = [];
var render_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) { render_callbacks.push(fn); }
function flush() {
    const saved_component = current_component;
    do {
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!callback.__calling) {
                callback.__calling = true;
                callback();
                callback.__calling = false;
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    update_scheduled = false;
    set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function mount_component(component, target, anchor) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = on_mount.map(run).filter(is_function);
    if (on_destroy) {
      on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
 if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null, ctx: null, props, update: noop, not_equal, bound: blank_object(),
        on_mount: [], on_destroy: [], before_update: [], after_update: [], context: new Map(parent_component ? parent_component.$$.context : []),
        callbacks: blank_object(), dirty, skip_bound: false
    };
    let ready = false;
    $$.ctx = instance ? instance(component, options.props || {}, (i, ret, ...rest) => {
        const value = rest.length ? rest[0] : ret;
        if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
            if (!$$.skip_bound) {
                if ($$.bound[i]) $$.bound[i](value);
                if (ready) make_dirty(component, i);
            }
        }
        return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        $$.fragment.c();
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() { destroy_component(this, 1); this.$destroy = noop; }
  $on(type, callback) {
    const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !Object.keys($$props).length == 0) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}

    function create_fragment(ctx) {
        let container, title, input, saveCheckboxContainer, saveCheckbox, saveLabel, modifiers, mainControls;
        let startButton, resetButton;
        let disposables = [];
        return {
            c() {
                container = element("div");
                container.className = "timer-view-container";
                
                title = element("h1");
                title.className = "timer-title";
                title.textContent = "File Timer";
                
                input = element("input");
                input.className = "time-display-input";
                
                saveCheckboxContainer = element("div");
                saveCheckboxContainer.className = "save-time-container";
                
                saveCheckbox = element("input");
                saveCheckbox.type = "checkbox";
                saveCheckbox.className = "save-time-checkbox";
                saveCheckbox.id = "save-time-checkbox";
                
                saveLabel = element("label");
                saveLabel.htmlFor = "save-time-checkbox";
                saveLabel.className = "save-time-label";
                saveLabel.textContent = "Save time for this file";
                
                saveCheckboxContainer.append(saveCheckbox, saveLabel);
                
                modifiers = element("div");
                modifiers.className = "time-modifiers";
                const modButtons = [
                    {t: "-1h", h: -1}, {t: "-10m", m: -10}, {t: "-1m", m: -1}, {t: "-1s", s: -1},
                    {t: "+1h", h: 1}, {t: "+10m", m: 10}, {t: "+1m", m: 1}, {t: "+1s", s: 1}
                ];
                modButtons.forEach(b => {
                    let btn = element("button");
                    btn.className = "mod-button";
                    btn.textContent = b.t;
                    disposables.push(listen(btn, "click", () => ctx[6](b.h || 0, b.m || 0, b.s || 0)));
                    modifiers.append(btn);
                });
                
                mainControls = element("div");
                mainControls.className = "main-controls";
                startButton = element("button");
                startButton.className = "main-control-button start";
                resetButton = element("button");
                resetButton.className = "main-control-button reset";
                resetButton.textContent = "Reset";
                mainControls.append(startButton, resetButton);
                
                container.append(title, input, saveCheckboxContainer, modifiers, mainControls);
            },
            m(target, anchor) {
                insert(target, container, anchor);
                disposables.push(listen(input, "input", ctx[9]));
                disposables.push(listen(input, "blur", ctx[10]));
                disposables.push(listen(saveCheckbox, "change", ctx[11]));
                disposables.push(listen(startButton, "click", ctx[7]));
                disposables.push(listen(resetButton, "click", ctx[8]));
                this.p(ctx, [-1]);
            },
            p(ctx, [dirty]) {
                if (dirty & 1) { input.value = ctx[0]; }
                if (dirty & 6) { startButton.textContent = (ctx[1] && !ctx[2]) ? "Pause" : "Start"; }
                if (dirty & 8) { saveCheckbox.checked = ctx[3]; }
            },
            d(detaching) {
                if (detaching) detach(container);
                disposables.forEach(d => d());
            }
        };
    }
    function instance($$self, $$props, $$invalidate) {
        let { plugin, file_path } = $$props;
        let timeString = "00:00:00";
        let isRunning = false;
        let isPaused = false;
        let saveTime = false;
        
        function formatTime(totalSeconds) {
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;
            const formatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            return formatted;
        }
        
        function parseTimeString(str) {
            const parts = str.split(':').map(p => parseInt(p) || 0);
            while (parts.length < 3) parts.unshift(0);
            const [h, m, s] = parts;
            return (h * 3600) + (m * 60) + s;
        }
        
        function updateLocalState(time, running, paused, save) {
            $$invalidate(1, isRunning = running);
            $$invalidate(2, isPaused = paused);
            $$invalidate(0, timeString = formatTime(time));
            $$invalidate(3, saveTime = save || false);
        }
        
        function loadStateForFile(path) {
            const timerState = plugin.settings.timers[path];

            if (timerState) {
                const save = timerState.saveTime || false;
                const timeToLoad = save ? timerState.initialTime : 0;
                updateLocalState(timeToLoad, false, false, save);
            } else {
                updateLocalState(0, false, false, false);
            }
        }
        
        function adjustTime(h, m, s) {
            if (isRunning) return;
            let totalSeconds = parseTimeString(timeString);
            totalSeconds += (h * 3600) + (m * 60) + s;
            if (totalSeconds < 0) totalSeconds = 0;
            plugin.startTimer(file_path, totalSeconds, true, saveTime);
        }
        
        function handleStartPause() {
            if (isRunning && !isPaused) {
                plugin.pauseTimer(file_path);
            } else {
                const totalSeconds = parseTimeString(timeString);
                plugin.startTimer(file_path, totalSeconds, false, saveTime);
            }
        }
        
        function handleReset() { plugin.resetTimer(file_path); }
        function handleInput() { $$invalidate(0, timeString = this.value); }
        function handleBlur() {
            const totalSeconds = parseTimeString(timeString);
            plugin.startTimer(file_path, totalSeconds, true, saveTime);
        }
        
        async function handleSaveTimeChange() {
            $$invalidate(3, saveTime = this.checked);
            await plugin.updateSaveTime(file_path, saveTime);
        }
        

        plugin.onTimerUpdate((path, time, running, paused, save) => {
            if (path === file_path) updateLocalState(time, running, paused, save);
        });
        
        $$self.$$set = $$props => {
            if ('file_path' in $$props) {
                $$invalidate(4, file_path = $$props.file_path);

                setTimeout(() => {
                    if (file_path) {
                        loadStateForFile(file_path);
                    }
                }, 0);
            }
        };

        if (file_path) {
            loadStateForFile(file_path);
        }
        
        return [
            timeString,
            isRunning,
            isPaused,
            saveTime,
            file_path,
            plugin,
            adjustTime,
            handleStartPause,
            handleReset,
            handleInput,
            handleBlur,
            handleSaveTimeChange
        ];
    }
class TimerComponent extends SvelteComponent {
    constructor(options) { super(); init(this, options, instance, create_fragment, safe_not_equal, { plugin: 3, file_path: 4 }); }
}

class SoundSuggestModal extends import_obsidian.FuzzySuggestModal {
    constructor(app, onSelect) {
        super(app);
        this.onSelect = onSelect;
    }
    getItems() {
        return this.app.vault.getFiles().filter(file => ['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(file.extension.toLowerCase()));
    }
    getItemText(file) { return file.path; }
    onChooseItem(file) { this.onSelect(file.path); }
}
class TimerView extends import_obsidian.ItemView {
    constructor(leaf, plugin) { super(leaf); this.plugin = plugin; }
    getViewType() { return "file-timer-view"; }
    getDisplayText() { return "File Timer"; }
    getIcon() { return "alarm-clock"; }
    async onOpen() {
        this.contentEl.innerHTML = '';

        let activeFile = this.app.workspace.getActiveFile();

        this.component = new TimerComponent({
            target: this.contentEl,
            props: {
                plugin: this.plugin,
                file_path: activeFile?.path
            }
        });

        if (!activeFile) {
            const checkInterval = setInterval(() => {
                activeFile = this.app.workspace.getActiveFile();
                if (activeFile && this.component) {
                    this.component.$set({ file_path: activeFile.path });
                    clearInterval(checkInterval);
                }
            }, 10);

            setTimeout(() => clearInterval(checkInterval), 5000);
        } else {
            setTimeout(() => {
                if (this.component) {
                    this.component.$set({ file_path: activeFile.path });
                }
            }, 100);
        }
    }
    async onClose() { if (this.component) this.component.$destroy(); }
    update() {
        const activeFile = this.app.workspace.getActiveFile();
        if (this.component && activeFile) {
            this.component.$set({ file_path: activeFile.path });
        }
    }
    reload() {
        if (this.component) {
            this.component.$destroy();
        }
        this.onOpen();
    }
}
class TimerSettingTab extends import_obsidian.PluginSettingTab {
    constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Timer Settings' });

        new import_obsidian.Setting(containerEl)
            .setName('Show ribbon icon')
            .setDesc('Toggle the icon in the left ribbon.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showRibbonIcon)
                .onChange(async (value) => {
                    this.plugin.settings.showRibbonIcon = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateRibbonIcon();
                }));

        new import_obsidian.Setting(containerEl)
            .setName('Notification Sound')
            .setDesc('Play a sound when the timer finishes')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.notificationSound)
                .onChange(async (value) => {
                    this.plugin.settings.notificationSound = value;
                    await this.plugin.saveSettings();
                }));

        new import_obsidian.Setting(containerEl)
            .setName('Notification Timeout')
            .setDesc('Timeout for notification in seconds. Set to 0 to disable auto-closing.')
            .addText(text => text
                .setPlaceholder('0')
                .setValue(String(this.plugin.settings.notificationTimeout))
                .onChange(async (value) => {
                    this.plugin.settings.notificationTimeout = Number(value) || 0;
                    await this.plugin.saveSettings();
                }));

        const volumeSetting = new import_obsidian.Setting(containerEl).setName('Volume');
        const volumeSlider = new import_obsidian.SliderComponent(volumeSetting.controlEl);
        const volumeText = new import_obsidian.TextComponent(volumeSetting.controlEl);

        volumeSlider
            .setLimits(0, 100, 1)
            .setValue(this.plugin.settings.volume)
            .onChange(async (value) => {
                this.plugin.settings.volume = value;
                await this.plugin.saveSettings();
            });
        
        volumeSlider.sliderEl.addEventListener('input', () => {
            const value = volumeSlider.getValue();
            volumeText.setValue(String(value));
            this.plugin.settings.volume = value;
        });

        volumeText
            .setValue(String(this.plugin.settings.volume))
            .onChange(async () => {
                const numValue = Math.clamp(Number(volumeText.getValue()) || 0, 0, 100);
                this.plugin.settings.volume = numValue;
                volumeSlider.setValue(numValue);
                await this.plugin.saveSettings();
            });
        volumeText.inputEl.style.width = "55px";
        volumeText.inputEl.style.textAlign = "right";
        volumeText.inputEl.style.marginLeft = "8px";

        new import_obsidian.Setting(containerEl)
            .setName('Custom Sound URL / Path')
            .setDesc('Enter a URL for an audio file, or browse for a local file in your vault. Leave empty to use the default sound.')
            .addText(text => {
                text.setPlaceholder('https://example.com/sound.mp3 or /sounds/sound.mp3')
                    .setValue(this.plugin.settings.customSoundUrl)
                    .onChange(async (value) => {
                        this.plugin.settings.customSoundUrl = value;
                        await this.plugin.saveSettings();
                    });
            })
            .addButton(button => {
                button.setButtonText('Browse').onClick(() => {
                    new SoundSuggestModal(this.app, (path) => {
                        this.plugin.settings.customSoundUrl = path;
                        this.plugin.saveSettings();
                        this.display();
                    }).open();
                });
            });
    }
}
const DEFAULT_SETTINGS = {
    notificationSound: true,
    notificationTimeout: 0,
    volume: 100,
    customSoundUrl: "",
    timers: {},
    showRibbonIcon: true
};
function playAudio(url, volume) {
  try {
    const audio = new Audio(url);
    audio.volume = volume / 100;
    
    audio.play().catch(e => {
      console.error("File Timer: Could not play audio.", e);
      new import_obsidian.Notice("File Timer: Error playing sound.");
    });
  } catch (e) {
    console.error("File Timer: Could not play audio.", e);
    new import_obsidian.Notice("File Timer: Error playing sound.");
  }
}
class FileTimerPlugin extends import_obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.timerUpdateCallbacks = new Set();
        this.ribbonIconEl = null;
    }
    async onload() {
        await this.loadSettings();
        let settingsChanged = false;
        for (const path in this.settings.timers) {
            const timer = this.settings.timers[path];

            if (timer.isRunning || timer.isPaused) {
                timer.isRunning = false;
                timer.isPaused = false;
                settingsChanged = true;
            }

            if (timer.saveTime && timer.initialTime > 0) {
                timer.remainingTime = timer.initialTime;
                settingsChanged = true;
            }
        }

        if (settingsChanged) {
            await this.saveSettingsNow();
        }

        this.addSettingTab(new TimerSettingTab(this.app, this));
        this.registerView("file-timer-view", (leaf) => new TimerView(leaf, this));

        this.addCommand({
            id: 'open-file-timer-view',
            name: 'Open Timer',
            callback: () => this.activateView()
        });

        this.updateRibbonIcon();

        this.app.workspace.on('active-leaf-change', () => this.updateView());
        this.registerInterval(window.setInterval(() => this.tick(), 1000));
    }
    updateRibbonIcon() {
        if (this.ribbonIconEl) {
            this.ribbonIconEl.remove();
            this.ribbonIconEl = null;
        }
        if (this.settings.showRibbonIcon) {
            this.ribbonIconEl = this.addRibbonIcon("alarm-clock", "File Timer", () => this.activateView());
        }
    }
    refreshAllTimerViews() {
        this.app.workspace.getLeavesOfType("file-timer-view").forEach(leaf => {
            if (leaf.view instanceof TimerView) {
                leaf.view.reload();
            }
        });
    }
    async onunload() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = null;
        }

        await this.saveData(this.settings);
        await new Promise(resolve => setTimeout(resolve, 50));
        await this.saveData(this.settings);
    }
    async loadSettings() {
        const loaded = await this.loadData();
        this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);
    }

    async saveSettings() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        
        this.saveTimeout = setTimeout(async () => {
            await this.saveData(this.settings);
            this.saveTimeout = null;
        }, 200);
    }
    
    async saveSettingsNow() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = null;
        }
        await this.saveData(this.settings);
    }
    updateView() {
        const leaf = this.app.workspace.getLeavesOfType("file-timer-view")[0];
        if (leaf && leaf.view instanceof TimerView) leaf.view.update();
    }
    tick() {
        let changed = false;
        for (const path in this.settings.timers) {
            const timer = this.settings.timers[path];
            if (timer.isRunning && !timer.isPaused) {
                timer.remainingTime--;
                changed = true;
                if (timer.remainingTime <= 0) {
                    timer.isRunning = false;
                    timer.remainingTime = 0;
                    new import_obsidian.Notice(`Timer finished for ${path}`, this.settings.notificationTimeout * 1000);
                    if (this.settings.notificationSound) {
                        let soundSrc = this.settings.customSoundUrl || 'https://github.com/m1nuzz/obsidian-file-timer/raw/refs/heads/main/timer.mp3';
                        if (soundSrc && !soundSrc.startsWith('http')) {
                            soundSrc = this.app.vault.adapter.getResourcePath(soundSrc);
                        }
                        playAudio(soundSrc, this.settings.volume);
                    }
                }
                this.broadcastTimerUpdate(path, timer.remainingTime, timer.isRunning, timer.isPaused);
            }
        }
        if (changed) this.saveSettings();
    }
    startTimer(filePath, totalSeconds, setupOnly = false, saveTime = false) {
    if (!filePath) return;
    let timer = this.settings.timers[filePath];
    if (!timer) {
        timer = {
            initialTime: totalSeconds,
            remainingTime: totalSeconds,
            isRunning: false,
            isPaused: false,
            saveTime: false
        };
    }

    if (setupOnly) {
        timer.initialTime = totalSeconds;
        timer.remainingTime = totalSeconds;
    } else {
        if (timer.isPaused) {
            timer.isPaused = false;
        } else {
            timer.initialTime = totalSeconds;
            timer.remainingTime = totalSeconds;
            timer.isRunning = true;
            timer.isPaused = false;
        }
    }

    this.settings.timers[filePath] = timer;
    this.broadcastTimerUpdate(filePath, timer.remainingTime, timer.isRunning, timer.isPaused, timer.saveTime || false);
    this.saveSettings();
}


    async updateSaveTime(filePath, saveTime) {
        if (!filePath) return;

        let timer = this.settings.timers[filePath];
        if (!timer) {
            timer = {
                initialTime: 0,
                remainingTime: 0,
                isRunning: false,
                isPaused: false,
                saveTime: saveTime
            };
        } else {
            timer.saveTime = saveTime;

            if (saveTime && timer.remainingTime > 0) {
                timer.initialTime = timer.remainingTime;
            }
        }

        this.settings.timers[filePath] = timer;

        await this.saveData(this.settings);

        await new Promise(resolve => setTimeout(resolve, 100));

        this.broadcastTimerUpdate(filePath, timer.remainingTime, timer.isRunning, timer.isPaused, timer.saveTime);
    }
    pauseTimer(filePath) {
        const timer = this.settings.timers[filePath];
        if (timer && timer.isRunning) {
            timer.isPaused = !timer.isPaused;
            this.broadcastTimerUpdate(filePath, timer.remainingTime, timer.isRunning, timer.isPaused);
        }
    }
    resetTimer(filePath) {
        const timer = this.settings.timers[filePath];
        if (timer) {
            timer.isRunning = false;
            timer.isPaused = false;
            timer.initialTime = 0;
            timer.remainingTime = 0;
            this.settings.timers[filePath] = timer;
            this.broadcastTimerUpdate(filePath, timer.remainingTime, timer.isRunning, timer.isPaused);
            this.saveSettings();
        }
    }
    onTimerUpdate(callback) {
        this.timerUpdateCallbacks.add(callback);
        return () => this.timerUpdateCallbacks.delete(callback);
    }
    broadcastTimerUpdate(path, time, isRunning, isPaused, saveTime) {
        for (const cb of this.timerUpdateCallbacks) cb(path, time, isRunning, isPaused, saveTime || false);
    }
    async activateView() {
        this.app.workspace.detachLeavesOfType("file-timer-view");
        await this.app.workspace.getRightLeaf(false).setViewState({
            type: "file-timer-view",
            active: true
        });

        const leaf = this.app.workspace.getLeavesOfType("file-timer-view")[0];
        this.app.workspace.revealLeaf(leaf);

        setTimeout(() => {
            if (leaf && leaf.view instanceof TimerView) {
                leaf.view.update();
            }
        }, 100);
    }
}