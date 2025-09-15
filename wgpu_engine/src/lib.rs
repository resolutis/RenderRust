use wasm_bindgen::prelude::*;
use web_sys::console;

// Enable console logging
#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
    console_log::init_with_level(log::Level::Warn).expect("Couldn't initialize logger");
}

#[wasm_bindgen]
pub struct WgpuRenderer {
    canvas: web_sys::HtmlCanvasElement,
    rotation: f32,
}

#[wasm_bindgen]
impl WgpuRenderer {
    #[wasm_bindgen(constructor)]
    pub fn new(canvas: web_sys::HtmlCanvasElement) -> WgpuRenderer {
        console::log_1(&"Initializing wgpu renderer...".into());

        WgpuRenderer {
            canvas,
            rotation: 0.0,
        }
    }

    pub fn render(&mut self) {
        self.rotation += 0.01;

        // Get the 2D rendering context with error handling
        let context = match self.canvas.get_context("2d") {
            Ok(Some(ctx)) => ctx,
            Ok(None) => {
                console::log_1(&"Canvas context is null".into());
                return;
            }
            Err(_) => {
                console::log_1(&"Failed to get 2d context".into());
                return;
            }
        };

        let ctx = match context.dyn_into::<web_sys::CanvasRenderingContext2d>() {
            Ok(ctx) => ctx,
            Err(_) => {
                console::log_1(&"Failed to cast to CanvasRenderingContext2d".into());
                return;
            }
        };

        let width = self.canvas.width() as f64;
        let height = self.canvas.height() as f64;

        // Clear canvas with a dark background
        ctx.set_fill_style(&"#1a1a2e".into());
        ctx.fill_rect(0.0, 0.0, width, height);

        // Draw rotating circles to simulate 3D sphere
        let center_x = width / 2.0;
        let center_y = height / 2.0;
        let radius = 100.0;

        for i in 0..10 {
            let angle = self.rotation + (i as f32 * 0.3);
            let x = center_x + (angle.cos() * radius) as f64;
            let y = center_y + (angle.sin() * radius * 0.5) as f64;
            let circle_radius = 20.0 - (i as f64 * 1.5);

            // Start a new path for each circle
            ctx.begin_path();

            // Draw the circle
            ctx.arc(x, y, circle_radius, 0.0, 2.0 * std::f64::consts::PI)
                .unwrap_or_else(|_| {
                    console::log_1(&"Failed to draw arc".into());
                });

            // Set fill color for this circle
            let color = format!(
                "rgba({}, {}, {}, 0.8)",
                100 + (i * 15),
                50 + (i * 10),
                200 - (i * 5)
            );
            ctx.set_fill_style(&color.into());

            // Fill the circle
            ctx.fill();
        }
    }

    pub fn resize(&mut self, width: u32, height: u32) {
        self.canvas.set_width(width);
        self.canvas.set_height(height);
    }
}
