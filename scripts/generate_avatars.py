"""
Generate 3D character avatars for all 13 Uniqcall archetypes using ComfyUI API.
Uses Flux Schnell GGUF + Pixar 3D LoRA for consistent 3D character style.
"""

import json
import time
import urllib.request
import urllib.error
import os
import random
import shutil

COMFYUI_URL = "http://127.0.0.1:8188"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "apps", "web", "public", "avatars")

# ComfyUI output directory where SaveImage writes to
COMFYUI_OUTPUT_DIR = r"C:\ComfyUI\output"

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 13 Archetype avatar prompts - Pixar 3D style, dark background, full body
ARCHETYPES = {
    "thinker": {
        "name": "The Thinker",
        "prompt": "Pixar 3D, full body character, a young intellectual boy with short neat dark hair, wearing round glasses and a dark navy futuristic lab coat with glowing blue circuit patterns, holding a transparent holographic cube floating above his palm, standing on a hexagonal tech platform, dark navy background with floating mathematical equations made of light, expressive big eyes showing curiosity, 3D render, cinematic lighting, ultra detailed, vibrant neon cyan and purple accents",
        "seed": 100,
    },
    "engineer": {
        "name": "The Engineer",
        "prompt": "Pixar 3D, full body character, a confident teenage boy with messy brown hair, wearing futuristic dark mechanic overalls with glowing orange circuit lines and utility belt, holding a robotic wrench and small drone companion hovering near shoulder, standing on a gear-shaped metal platform, dark navy background with floating holographic blueprints and gears, big determined eyes, 3D render, cinematic lighting, ultra detailed, vibrant orange and cyan neon accents",
        "seed": 200,
    },
    "guardian": {
        "name": "The Guardian",
        "prompt": "Pixar 3D, full body character, a strong dignified teenage girl with braided silver hair tied back, wearing dark navy futuristic armor suit with glowing gold scales and a balance symbol on the chest, holding a shield made of light, standing on a pillar-shaped justice platform, dark navy background with floating scroll symbols and golden light particles, determined protective expression with big eyes, 3D render, cinematic lighting, ultra detailed, vibrant gold and blue accents",
        "seed": 300,
    },
    "strategist": {
        "name": "The Strategist",
        "prompt": "Pixar 3D, full body character, a sharp-looking teenage boy with slicked back dark hair, wearing a sleek dark navy futuristic commander coat with glowing emerald green data lines, one hand raised controlling a holographic 3D chess board floating in front of him, standing on a map-shaped tactical platform, dark navy background with floating strategic diagrams and constellation lines, confident calculating expression with big eyes, 3D render, cinematic lighting, ultra detailed, green and cyan neon accents",
        "seed": 400,
    },
    "creator": {
        "name": "The Creator",
        "prompt": "Pixar 3D, full body character, an energetic teenage girl with wild colorful streaked hair in pink and purple, wearing a dark futuristic artist smock splashed with rainbow neon paint, one hand painting light in the air creating a floating holographic sculpture, standing on a paint-splattered crystalline platform, dark navy background with floating color orbs and light brushstrokes, joyful creative expression with big sparkling eyes, 3D render, cinematic lighting, ultra detailed, vibrant rainbow neon accents",
        "seed": 500,
    },
    "shaper": {
        "name": "The Shaper",
        "prompt": "Pixar 3D, full body character, a focused teenage boy with neat styled hair and thin frame glasses, wearing a dark navy futuristic architect jacket with glowing teal wireframe patterns, holding a miniature holographic building model floating between his hands, standing on a blueprint-grid platform, dark navy background with floating geometric shapes and architectural wireframes, thoughtful precise expression with big eyes, 3D render, cinematic lighting, ultra detailed, teal and white neon accents",
        "seed": 600,
    },
    "storyteller": {
        "name": "The Storyteller",
        "prompt": "Pixar 3D, full body character, a charismatic teenage girl with flowing dark wavy hair, wearing a dark futuristic journalist coat with glowing amber text scrolling along the edges, holding an ethereal book with words floating up from its pages like fireflies, standing on an open book shaped platform, dark navy background with floating letters and story fragments made of light, warm expressive face with big emotive eyes, 3D render, cinematic lighting, ultra detailed, warm amber and gold neon accents",
        "seed": 700,
    },
    "performer": {
        "name": "The Performer",
        "prompt": "Pixar 3D, full body character, a dynamic teenage boy with spiky styled hair with magenta tips, wearing a dark futuristic stage outfit with glowing pink and purple sound wave patterns, one hand raised with musical notes made of light swirling around him, standing on a star-shaped stage platform, dark navy background with floating spotlights and musical frequency visualizations, confident showman expression with big bright eyes, 3D render, cinematic lighting, ultra detailed, magenta and purple neon accents",
        "seed": 800,
    },
    "healer": {
        "name": "The Healer",
        "prompt": "Pixar 3D, full body character, a gentle teenage girl with soft shoulder-length light hair and compassionate expression, wearing a dark futuristic medical coat with glowing soft green life-sign patterns and a floating caduceus hologram near her shoulder, hands gently cupped holding a glowing healing orb of soft green light, standing on a lotus-shaped platform, dark navy background with floating DNA helixes and gentle particle effects, kind caring expression with big warm eyes, 3D render, cinematic lighting, ultra detailed, soft green and teal neon accents",
        "seed": 900,
    },
    "diplomat": {
        "name": "The Diplomat",
        "prompt": "Pixar 3D, full body character, an elegant teenage boy with neat combed hair and thoughtful expression, wearing a dark futuristic formal suit with glowing blue diplomatic sash and globe hologram pin, hands together in a welcoming gesture with a floating holographic globe between them showing connected lines, standing on a round peace-symbol platform, dark navy background with floating flags and connecting bridge light arcs, calm wise expression with big understanding eyes, 3D render, cinematic lighting, ultra detailed, royal blue and silver neon accents",
        "seed": 1000,
    },
    "explorer": {
        "name": "The Explorer",
        "prompt": "Pixar 3D, full body character, an adventurous teenage girl with windswept auburn hair and freckles, wearing a dark futuristic expedition jacket with glowing amber compass patterns and a holographic map projected from her wrist device, one hand shielding eyes looking into the distance, a small robot companion on her backpack, standing on a compass-rose shaped platform, dark navy background with floating topographic lines and starfield, excited adventurous expression with big curious eyes, 3D render, cinematic lighting, ultra detailed, amber and cyan neon accents",
        "seed": 1100,
    },
    "mentor": {
        "name": "The Mentor",
        "prompt": "Pixar 3D, full body character, a wise warm teenage girl with neatly pinned up hair and glasses on her head, wearing a dark futuristic teacher robe with glowing warm yellow knowledge-symbol patterns, holding an open holographic book projecting a miniature classroom of tiny students above it, standing on a podium shaped platform, dark navy background with floating chalkboard equations and gentle light sparkles, warm encouraging expression with big kind eyes, 3D render, cinematic lighting, ultra detailed, warm yellow and soft orange neon accents",
        "seed": 1200,
    },
    "visionary": {
        "name": "The Visionary",
        "prompt": "Pixar 3D, full body character, a bold teenage boy with modern undercut hairstyle and intense focused eyes, wearing a dark futuristic innovator hoodie with glowing electric purple constellation patterns and a small rocket hologram floating above his shoulder, one hand reaching up touching a floating holographic lightbulb made of stars, standing on a rocket-launchpad shaped platform, dark navy background with floating futuristic cityscapes and wormhole effects, visionary determined expression with big inspired eyes, 3D render, cinematic lighting, ultra detailed, electric purple and cyan neon accents",
        "seed": 1300,
    },
}


def build_prompt(text: str, seed: int, filename_prefix: str) -> dict:
    """Build ComfyUI workflow for Flux Schnell + Pixar 3D LoRA."""
    return {
        "1": {
            "class_type": "UnetLoaderGGUF",
            "inputs": {
                "unet_name": "flux1-schnell-Q4_K_S.gguf"
            }
        },
        "2": {
            "class_type": "DualCLIPLoaderGGUF",
            "inputs": {
                "clip_name1": "clip_l.safetensors",
                "clip_name2": "t5-v1_1-xxl-encoder-Q8_0.gguf",
                "type": "flux"
            }
        },
        "3": {
            "class_type": "VAELoader",
            "inputs": {
                "vae_name": "flux-vae-bf16.safetensors"
            }
        },
        "10": {
            "class_type": "LoraLoader",
            "inputs": {
                "lora_name": "Canopus-Pixar-3D-FluxDev-LoRA.safetensors",
                "strength_model": 0.85,
                "strength_clip": 0.85,
                "model": ["1", 0],
                "clip": ["2", 0]
            }
        },
        "4": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "text": text,
                "clip": ["10", 1]
            }
        },
        "5": {
            "class_type": "EmptySD3LatentImage",
            "inputs": {
                "width": 768,
                "height": 768,
                "batch_size": 1
            }
        },
        "6": {
            "class_type": "KSampler",
            "inputs": {
                "seed": seed,
                "steps": 4,
                "cfg": 1.0,
                "sampler_name": "euler",
                "scheduler": "simple",
                "denoise": 1.0,
                "model": ["10", 0],
                "positive": ["4", 0],
                "negative": ["7", 0],
                "latent_image": ["5", 0]
            }
        },
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "text": "",
                "clip": ["10", 1]
            }
        },
        "8": {
            "class_type": "VAEDecode",
            "inputs": {
                "samples": ["6", 0],
                "vae": ["3", 0]
            }
        },
        "9": {
            "class_type": "SaveImage",
            "inputs": {
                "filename_prefix": filename_prefix,
                "images": ["8", 0]
            }
        }
    }


def submit_and_wait(prompt_data: dict, label: str, timeout: int = 600) -> tuple[float, bool, dict]:
    """Submit a prompt to ComfyUI and wait for completion."""
    payload = json.dumps({"prompt": prompt_data}).encode("utf-8")
    req = urllib.request.Request(
        f"{COMFYUI_URL}/prompt",
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    
    try:
        resp = urllib.request.urlopen(req)
        result = json.loads(resp.read())
        prompt_id = result["prompt_id"]
        print(f"  [{label}] Submitted → prompt_id: {prompt_id}")
    except Exception as e:
        print(f"  [{label}] Submit FAILED: {e}")
        return 0, False, {}

    start = time.time()
    while time.time() - start < timeout:
        try:
            hist_resp = urllib.request.urlopen(f"{COMFYUI_URL}/history/{prompt_id}")
            hist = json.loads(hist_resp.read())
            if prompt_id in hist:
                elapsed = time.time() - start
                outputs = hist[prompt_id].get("outputs", {})
                print(f"  [{label}] Done in {elapsed:.1f}s")
                return elapsed, True, outputs
        except Exception:
            pass
        time.sleep(2)

    elapsed = time.time() - start
    print(f"  [{label}] TIMEOUT after {elapsed:.1f}s")
    return elapsed, False, {}


def copy_output_image(outputs: dict, archetype_code: str) -> str | None:
    """Find the generated image in ComfyUI output and copy to web app public/avatars/."""
    for node_id, node_out in outputs.items():
        if "images" in node_out:
            for img_info in node_out["images"]:
                src_filename = img_info["filename"]
                subfolder = img_info.get("subfolder", "")
                src_path = os.path.join(COMFYUI_OUTPUT_DIR, subfolder, src_filename)
                
                dst_filename = f"{archetype_code}.png"
                dst_path = os.path.join(OUTPUT_DIR, dst_filename)
                
                if os.path.exists(src_path):
                    shutil.copy2(src_path, dst_path)
                    print(f"  Copied: {src_filename} → avatars/{dst_filename}")
                    return dst_path
                else:
                    print(f"  WARNING: Source not found: {src_path}")
                    # Try downloading via API instead
                    try:
                        img_url = f"{COMFYUI_URL}/view?filename={src_filename}&subfolder={subfolder}&type=output"
                        urllib.request.urlretrieve(img_url, dst_path)
                        print(f"  Downloaded via API: avatars/{dst_filename}")
                        return dst_path
                    except Exception as e:
                        print(f"  Download failed: {e}")
    return None


def main():
    print("=" * 60)
    print("Uniqcall Education - Avatar Generation")
    print(f"Using: Flux Schnell GGUF + Pixar 3D LoRA")
    print(f"Resolution: 768x768 | Steps: 4 | Output: {OUTPUT_DIR}")
    print("=" * 60)
    
    # Test ComfyUI connectivity
    try:
        urllib.request.urlopen(f"{COMFYUI_URL}/system_stats")
        print("\nComfyUI is running. Starting generation...\n")
    except Exception as e:
        print(f"\nERROR: Cannot connect to ComfyUI at {COMFYUI_URL}")
        print(f"  Start ComfyUI first: C:\\ComfyUI\\start_comfyui.bat")
        return

    results = {}
    total = len(ARCHETYPES)
    
    for idx, (code, info) in enumerate(ARCHETYPES.items(), 1):
        print(f"\n{'─' * 60}")
        print(f"[{idx}/{total}] Generating: {info['name']} ({code})")
        print(f"{'─' * 60}")
        
        prefix = f"uniqcall_{code}"
        prompt_data = build_prompt(info["prompt"], info["seed"], prefix)
        
        elapsed, success, outputs = submit_and_wait(prompt_data, code)
        
        if success:
            img_path = copy_output_image(outputs, code)
            results[code] = {
                "success": True,
                "time": elapsed,
                "path": img_path,
            }
        else:
            results[code] = {
                "success": False,
                "time": elapsed,
                "path": None,
            }
    
    # Summary
    print(f"\n\n{'=' * 60}")
    print("GENERATION SUMMARY")
    print(f"{'=' * 60}")
    
    succeeded = sum(1 for r in results.values() if r["success"])
    failed = total - succeeded
    total_time = sum(r["time"] for r in results.values())
    
    for code, r in results.items():
        status = "OK" if r["success"] else "FAILED"
        print(f"  {ARCHETYPES[code]['name']:20s} ({code:12s}) — {r['time']:6.1f}s — {status}")
    
    print(f"\n  Total: {succeeded}/{total} succeeded | {failed} failed | {total_time:.0f}s total")
    print(f"  Output: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
