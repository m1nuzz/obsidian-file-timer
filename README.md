# File Timer Plugin for Obsidian

<a href="https://ko-fi.com/m1nuz"><img src="https://img.shields.io/static/v1?label=Buy%20me%20a%20coffee&message=%E2%98%95&logo=Ko-fi&color=%23FF5E5B" height="25" /></a>

Start a simple countdown timer in a side view. Quickly adjust time with ± buttons. Optionally save the last entered duration per file (via checkbox) to reuse next time. Plays an optional sound when the timer finishes.

## Features

- **File-specific timers**: Each file in Obsidian can have its own independent timer
- **Side panel view**: Clean, dedicated interface for timer management
- **Quick time adjustment**: Use ± buttons to quickly modify time:
  - -1h, -10m, -1m, -1s (decrease time)
  - +1h, +10m, +1m, +1s (increase time)
- **Persistent duration**: Save the last entered duration per file for automatic reuse
- **Start/Pause/Reset controls**: Full control over timer state
- **Visual display**: Clear time display in HH:MM:SS format
- **Audio notifications**: Optional sound plays when timer completes
- **Responsive design**: Adapts to different screen sizes

## Installation

### From GitHub (Manual Installation)

1. Download the latest release from the [GitHub releases page](https://github.com/m1nuzz/obsidian-file-timer/releases)
2. Extract the downloaded files to your Obsidian vault's `.obsidian/plugins/` folder
3. Restart Obsidian
4. Enable the plugin in Settings > Community plugins

### From Obsidian Marketplace (when available)

1. Open Obsidian Settings
2. Go to Community Plugins
3. Search for "File Timer"
4. Install and enable the plugin

## Usage

1. Open the timer view by:
   - Using the command palette (`Ctrl/Cmd+P`) and searching for "Open Timer"
   - Clicking the alarm clock icon in the left ribbon (if enabled)
   - Or manually creating a right sidebar view

2. The timer will automatically sync with the currently active file

3. Enter your desired time in HH:MM:SS format or use the ± buttons to adjust

4. Click "Start" to begin the countdown

5. Use "Pause" to temporarily stop the timer or "Reset" to clear it

6. Check "Save time for this file" to remember the duration for this specific file

## Settings

The plugin offers several customizable options:

- **Show ribbon icon**: Toggle the alarm clock icon in the left ribbon
- **Notification Sound**: Enable/disable sound when timer finishes
- **Notification Timeout**: Set how long notifications stay visible (in seconds, 0 to disable auto-close)
- **Volume**: Adjust the notification sound volume (0-100%)
- **Custom Sound URL/Path**: Use your own audio file instead of the default sound
  - Enter a URL to an audio file (MP3, WAV, OGG, M4A, FLAC)
  - Or browse for a local file in your vault using the Browse button

## Keyboard Shortcuts

Currently, the plugin doesn't have specific keyboard shortcuts, but you can create custom ones via Obsidian's command palette.

## Support

If you find this plugin useful, consider supporting the developer:

[ko-fi](https://ko-fi.com/m1nuz)

## Development

This plugin is developed by m1nuzz. The source code is available on GitHub.

### Building from Source

1. Clone the repository
2. Run `npm install`
3. Run `npm run build`
4. The built files will be in the dist folder

## Compatibility

- Minimum Obsidian version: 0.15.0
- Works on desktop and mobile
- No desktop-only restrictions

## Changelog

### v1.0.0
- Initial release
- File-specific timers
- Side panel interface
- Quick time adjustment buttons
- Save duration per file option
- Audio notifications