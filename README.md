# perfect-pixel

An Electron application with Vue and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```


build icon
```
sips -z 16 16     resources/icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     resources/icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     resources/icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     resources/icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   resources/icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   resources/icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   resources/icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   resources/icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   resources/icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 resources/icon.png --out icon.iconset/icon_512x512@2x.png


iconutil -c icns icon.iconset -o build/icon.icns
```