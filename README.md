# Exposure-Guide.Cube

Exposure-Guide.Cube is a web-based application designed to generate false color exposure LUTs for professional cinema cameras (including Sony, Panasonic, Canon, ARRI, RED, and Blackmagic). 

It allows you to map specific exposure ranges (either in camera Stops or IRE scale) to custom colors, helping you precisely monitor exposure and white balance at the same time on set or in post-production. The tool outputs a standard `.cube` file which can be loaded directly into your monitor or editing software.

## Acknowledgments & Original Source

The core logic, math, and concept behind this application were originally created by **Alpha Bravo Media**. Their original tool was a powerful, command-line based script without a graphical user interface.

- **Original Creator:** Alpha Bravo Media
- **YouTube Video:** [Free False Color LUT Builder: Monitor Exposure AND White Balance at the Same Time](https://www.youtube.com/watch?v=fwnOEfC48HU)
- **Original Source Code:** [Today20092/lut_builder](https://github.com/Today20092/lut_builder)

This repository (`SMOSTORY/Exposure-Guide.Cube`) is an enhanced version that features a fully responsive, modern Graphical User Interface (GUI) built to make the process more accessible and visual.

The user interface was built with the assistance of **Gemini**.

## How to Use the LUT (.cube file)

Once you generate and download your custom false color `.cube` file, you can load it into your editing software for post-production or directly onto your camera for monitoring on set.

### Editing Software

**DaVinci Resolve**
1. Open your project and go to the **Color** page.
2. Open the **LUTs** panel in the top left corner.
3. Right-click anywhere in the panel and select **Open LUT Folder**.
4. Copy your new `.cube` file into this folder.
5. Back in DaVinci Resolve, right-click in the LUTs panel again and click **Refresh**. 
6. You can now apply this LUT to a node. *Note: Use it as a monitoring diagnostic to check your exposure, then disable it before rendering your final creative grade.*

**Premiere Pro and Final Cut Pro**
Import the `.cube` file as a custom LUT in the application's color workflow. Use it as a monitoring diagnostic, not as the final creative grade.

### Loading on Cameras

**Sony (e.g., FX3, FX6, A7S III)**
1. Format an SD card in your camera.
2. Insert the SD card into your computer.
3. Navigate to the `PRO/LUT` folder on the SD card (the exact path might vary slightly depending on your camera model).
4. Copy the `.cube` file into this folder.
5. Put the SD card back into your Sony camera.
6. Go to your camera's menu: **Exposure/Color** > **Color/Tone** > **Manage User LUTs** and import the file to monitor your exposure.

**Panasonic Lumix (e.g., S5II, GH6)**
1. Format an SD card in your camera.
2. Insert the SD card into your computer and copy the `.cube` file into the main/root directory (do not put it inside any folders).
3. Put the SD card back into your Lumix camera.
4. Go to the camera menu: **Image Quality** > **LUT Library**.
5. Select an empty slot and load your `.cube` file from the SD card.
