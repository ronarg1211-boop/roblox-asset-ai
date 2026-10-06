#!/usr/bin/env python3
"""
Roblox Asset AI - High-Domain Synthetic Dataset Pipeline
Produces specialized training datasets for fine-tuning a small, dedicated
Roblox Studio LLM (e.g. Qwen2.5-Coder-1.5B or Llama-3.2-1B) on Kaggle.

The generated dataset strictly conditions the model to:
1. Generate valid Roblox 3D Intermediate Representation (IR) Models.
2. Generate valid Roblox Animation IR with Keyframes and joint poses.
3. Generate vision-based structural critiques and iterative refinements.
4. Output STRICT JSON ONLY - no chatbot conversation, no pleasantries, no markdown.
"""

import json
import os
import random
import sys
from typing import Dict, Any, List

# 35+ Real Roblox Asset Blueprints with actual part hierarchies
MODEL_BLUEPRINTS = [
    # Weapons
    {
        "name": "KnightBroadsword",
        "category": "weapons",
        "keywords": ["sword", "blade", "broadsword", "knight sword"],
        "parts": [
            {"name": "HandleGrip", "className": "Part", "shape": "Cylinder", "size": [0.35, 1.4, 0.35], "pos": [0, 0.7, 0], "mat": "Fabric", "col": [90, 55, 35]},
            {"name": "Pommel", "className": "Part", "shape": "Ball", "size": [0.6, 0.6, 0.6], "pos": [0, -0.1, 0], "mat": "Metal", "col": [220, 180, 50]},
            {"name": "Crossguard", "className": "Part", "shape": "Block", "size": [1.8, 0.25, 0.6], "pos": [0, 1.5, 0], "mat": "Metal", "col": [220, 180, 50]},
            {"name": "BladeMain", "className": "Part", "shape": "Block", "size": [0.55, 4.2, 0.12], "pos": [0, 3.7, 0], "mat": "Metal", "col": [210, 215, 225]},
            {"name": "BladeTip", "className": "WedgePart", "shape": "Wedge", "size": [0.55, 0.8, 0.12], "pos": [0, 6.2, 0], "mat": "Metal", "col": [210, 215, 225]},
            {"name": "FullerGroove", "className": "Part", "shape": "Block", "size": [0.15, 3.2, 0.14], "pos": [0, 3.4, 0], "mat": "Metal", "col": [70, 75, 85]}
        ]
    },
    {
        "name": "KnightKiteShield",
        "category": "weapons",
        "keywords": ["shield", "kite shield", "knight shield"],
        "parts": [
            {"name": "ShieldPlate", "className": "Part", "shape": "Block", "size": [3.4, 4.4, 0.35], "pos": [0, 2.6, 0], "mat": "WoodPlanks", "col": [140, 45, 45]},
            {"name": "RimTop", "className": "Part", "shape": "Block", "size": [3.6, 0.3, 0.45], "pos": [0, 4.8, 0], "mat": "Metal", "col": [75, 80, 90]},
            {"name": "ShieldBoss", "className": "Part", "shape": "Ball", "size": [1.2, 1.2, 0.7], "pos": [0, 2.6, 0.25], "mat": "Metal", "col": [220, 180, 50]},
            {"name": "BossSpike", "className": "Part", "shape": "Cylinder", "size": [0.6, 0.3, 0.3], "pos": [0, 2.6, 0.7], "mat": "Metal", "col": [240, 200, 60]}
        ]
    },
    {
        "name": "ArcaneStaff",
        "category": "weapons",
        "keywords": ["magic staff", "arcane staff", "wizard staff", "wand"],
        "parts": [
            {"name": "StaffShaft", "className": "Part", "shape": "Cylinder", "size": [0.35, 5.8, 0.35], "pos": [0, 2.9, 0], "mat": "Wood", "col": [85, 50, 30]},
            {"name": "CrystalSocket", "className": "Part", "shape": "Cylinder", "size": [0.9, 0.7, 0.9], "pos": [0, 5.8, 0], "mat": "Metal", "col": [220, 180, 50]},
            {"name": "ArcaneCrystal", "className": "Part", "shape": "Ball", "size": [1.2, 1.6, 1.2], "pos": [0, 6.7, 0], "mat": "Neon", "col": [0, 230, 255]},
            {"name": "OrbitalRing", "className": "Part", "shape": "Cylinder", "size": [0.15, 2.0, 2.0], "pos": [0, 6.7, 0], "mat": "Metal", "col": [240, 200, 60]}
        ]
    },
    {
        "name": "SciFiBlaster",
        "category": "weapons",
        "keywords": ["blaster", "laser gun", "plasma rifle", "sci-fi gun"],
        "parts": [
            {"name": "ReceiverBody", "className": "Part", "shape": "Block", "size": [0.6, 0.9, 2.2], "pos": [0, 1.8, 0], "mat": "Metal", "col": [35, 38, 45]},
            {"name": "LaserBarrel", "className": "Part", "shape": "Cylinder", "size": [0.4, 0.4, 1.8], "pos": [0, 1.9, 1.6], "mat": "Metal", "col": [55, 60, 70]},
            {"name": "PistolGrip", "className": "Part", "shape": "Block", "size": [0.45, 1.1, 0.6], "pos": [0, 1.1, -0.6], "mat": "SmoothPlastic", "col": [25, 25, 30]},
            {"name": "EnergyCell", "className": "Part", "shape": "Block", "size": [0.5, 0.8, 0.6], "pos": [0, 1.1, 0.3], "mat": "Neon", "col": [0, 230, 255]}
        ]
    },

    # Props & Nature
    {
        "name": "StylizedTreasureChest",
        "category": "props",
        "keywords": ["treasure chest", "wooden chest", "loot chest", "pirate chest"],
        "parts": [
            {"name": "ChestBase", "className": "Part", "shape": "Block", "size": [4.0, 2.0, 2.8], "pos": [0, 1.0, 0], "mat": "WoodPlanks", "col": [115, 70, 40]},
            {"name": "ChestLid", "className": "Part", "shape": "Block", "size": [4.0, 1.2, 2.8], "pos": [0, 2.6, 0], "mat": "WoodPlanks", "col": [115, 70, 40]},
            {"name": "IronBandLeft", "className": "Part", "shape": "Block", "size": [0.35, 2.05, 2.9], "pos": [-1.2, 1.0, 0], "mat": "Metal", "col": [75, 80, 88]},
            {"name": "IronBandRight", "className": "Part", "shape": "Block", "size": [0.35, 2.05, 2.9], "pos": [1.2, 1.0, 0], "mat": "Metal", "col": [75, 80, 88]},
            {"name": "GoldHaspLatch", "className": "Part", "shape": "Block", "size": [0.6, 0.8, 0.2], "pos": [0, 2.0, 1.45], "mat": "Metal", "col": [230, 190, 50]}
        ]
    },
    {
        "name": "ShippingCrate",
        "category": "props",
        "keywords": ["wooden crate", "storage box", "cargo crate"],
        "parts": [
            {"name": "CrateCore", "className": "Part", "shape": "Block", "size": [3.2, 3.2, 3.2], "pos": [0, 1.6, 0], "mat": "WoodPlanks", "col": [130, 85, 45]},
            {"name": "TopRimFrame", "className": "Part", "shape": "Block", "size": [3.35, 0.35, 3.35], "pos": [0, 3.1, 0], "mat": "Wood", "col": [100, 65, 35]},
            {"name": "BottomRimFrame", "className": "Part", "shape": "Block", "size": [3.35, 0.35, 3.35], "pos": [0, 0.17, 0], "mat": "Wood", "col": [100, 65, 35]},
            {"name": "FrontDiagonalBrace", "className": "Part", "shape": "Block", "size": [0.25, 3.4, 0.3], "pos": [0, 1.6, 1.65], "mat": "Wood", "col": [110, 72, 38]}
        ]
    },
    {
        "name": "OakStorageBarrel",
        "category": "props",
        "keywords": ["barrel", "wooden barrel", "beer cask", "water barrel"],
        "parts": [
            {"name": "BarrelBody", "className": "Part", "shape": "Cylinder", "size": [2.8, 3.4, 2.8], "pos": [0, 1.7, 0], "mat": "WoodPlanks", "col": [120, 75, 42]},
            {"name": "TopIronHoop", "className": "Part", "shape": "Cylinder", "size": [2.85, 0.3, 2.85], "pos": [0, 3.0, 0], "mat": "Metal", "col": [65, 70, 78]},
            {"name": "BottomIronHoop", "className": "Part", "shape": "Cylinder", "size": [2.85, 0.3, 2.85], "pos": [0, 0.4, 0], "mat": "Metal", "col": [65, 70, 78]},
            {"name": "DispenserSpigot", "className": "Part", "shape": "Cylinder", "size": [0.2, 0.6, 0.2], "pos": [0, 0.8, 1.5], "mat": "Wood", "col": [90, 55, 30]}
        ]
    },
    {
        "name": "CampsiteFire",
        "category": "props",
        "keywords": ["campfire", "bonfire", "camp fire with stones", "fire pit"],
        "parts": [
            {"name": "AshBed", "className": "Part", "shape": "Cylinder", "size": [3.6, 0.2, 3.6], "pos": [0, 0.1, 0], "mat": "Slate", "col": [45, 45, 50]},
            {"name": "HearthStone", "className": "Part", "shape": "Ball", "size": [0.75, 0.55, 0.75], "pos": [1.6, 0.3, 0], "mat": "Cobblestone", "col": [110, 115, 120]},
            {"name": "CampfireLog", "className": "Part", "shape": "Cylinder", "size": [0.4, 2.4, 0.4], "pos": [0, 0.35, 0], "mat": "Wood", "col": [85, 50, 28]},
            {"name": "FireCoreFlame", "className": "Part", "shape": "Ball", "size": [1.2, 1.8, 1.2], "pos": [0, 1.1, 0], "mat": "Neon", "col": [255, 120, 20]}
        ]
    },
    {
        "name": "StylizedPineTree",
        "category": "environment",
        "keywords": ["pine tree", "conifer", "evergreen tree", "forest tree"],
        "parts": [
            {"name": "TreeTrunk", "className": "Part", "shape": "Cylinder", "size": [1.2, 5.2, 1.2], "pos": [0, 2.6, 0], "mat": "Wood", "col": [110, 68, 38]},
            {"name": "CanopyTierLower", "className": "Part", "shape": "Ball", "size": [4.6, 3.2, 4.6], "pos": [0, 5.4, 0], "mat": "Grass", "col": [40, 130, 55]},
            {"name": "CanopyTierMiddle", "className": "Part", "shape": "Ball", "size": [3.8, 2.8, 3.8], "pos": [0, 7.2, 0], "mat": "Grass", "col": [50, 145, 65]},
            {"name": "CanopyTierTop", "className": "Part", "shape": "Ball", "size": [2.6, 2.4, 2.6], "pos": [0, 8.8, 0], "mat": "Grass", "col": [60, 160, 75]}
        ]
    },
    {
        "name": "MagicCrystalCore",
        "category": "props",
        "keywords": ["crystal core", "magic crystal", "mana crystal", "glowing crystal"],
        "parts": [
            {"name": "CrystalAltarBase", "className": "Part", "shape": "Cylinder", "size": [4.4, 0.8, 4.4], "pos": [0, 0.4, 0], "mat": "Cobblestone", "col": [75, 80, 92]},
            {"name": "AltarPillar", "className": "Part", "shape": "Cylinder", "size": [2.6, 1.2, 2.6], "pos": [0, 1.4, 0], "mat": "Slate", "col": [60, 65, 75]},
            {"name": "ArcaneCrystalMonolith", "className": "Part", "shape": "Block", "size": [1.6, 3.8, 1.6], "pos": [0, 4.2, 0], "mat": "Neon", "col": [0, 230, 255]},
            {"name": "FloatingRunicRing", "className": "Part", "shape": "Cylinder", "size": [0.15, 3.6, 3.6], "pos": [0, 4.2, 0], "mat": "Metal", "col": [240, 200, 50]}
        ]
    },

    # Furniture
    {
        "name": "StylizedArmchair",
        "category": "furniture",
        "keywords": ["chair", "wooden armchair", "throne", "dining chair"],
        "parts": [
            {"name": "ChairSeatBase", "className": "Part", "shape": "Block", "size": [2.4, 0.4, 2.4], "pos": [0, 1.6, 0], "mat": "Wood", "col": [115, 75, 45]},
            {"name": "ChairLeg_FL", "className": "Part", "shape": "Cylinder", "size": [0.35, 1.6, 0.35], "pos": [-0.95, 0.8, 0.95], "mat": "Wood", "col": [95, 60, 35]},
            {"name": "ChairLeg_FR", "className": "Part", "shape": "Cylinder", "size": [0.35, 1.6, 0.35], "pos": [0.95, 0.8, 0.95], "mat": "Wood", "col": [95, 60, 35]},
            {"name": "BackrestPanel", "className": "Part", "shape": "Block", "size": [2.4, 2.6, 0.3], "pos": [0, 3.1, -1.05], "mat": "WoodPlanks", "col": [115, 75, 45]},
            {"name": "PlushSeatCushion", "className": "Part", "shape": "Block", "size": [2.2, 0.35, 2.2], "pos": [0, 1.9, 0], "mat": "Fabric", "col": [180, 35, 45]}
        ]
    },
    {
        "name": "RusticBanquetTable",
        "category": "furniture",
        "keywords": ["table", "banquet table", "wooden table", "dining table"],
        "parts": [
            {"name": "BanquetTabletop", "className": "Part", "shape": "Block", "size": [6.4, 0.45, 3.6], "pos": [0, 2.6, 0], "mat": "WoodPlanks", "col": [110, 70, 40]},
            {"name": "TableLeg_FL", "className": "Part", "shape": "Cylinder", "size": [0.55, 2.4, 0.55], "pos": [-2.8, 1.2, 1.4], "mat": "Wood", "col": [90, 55, 30]},
            {"name": "TableLeg_FR", "className": "Part", "shape": "Cylinder", "size": [0.55, 2.4, 0.55], "pos": [2.8, 1.2, 1.4], "mat": "Wood", "col": [90, 55, 30]},
            {"name": "CenterStretcherBeam", "className": "Part", "shape": "Block", "size": [5.6, 0.35, 0.35], "pos": [0, 0.6, 0], "mat": "Wood", "col": [90, 55, 30]}
        ]
    },
    {
        "name": "LivingRoomSofa",
        "category": "furniture",
        "keywords": ["sofa", "couch", "living room couch"],
        "parts": [
            {"name": "SofaBaseFrame", "className": "Part", "shape": "Block", "size": [6.2, 0.6, 3.2], "pos": [0, 0.7, 0], "mat": "Fabric", "col": [45, 55, 75]},
            {"name": "HighBackrest", "className": "Part", "shape": "Block", "size": [6.2, 2.4, 0.8], "pos": [0, 2.1, -1.2], "mat": "Fabric", "col": [45, 55, 75]},
            {"name": "ArmrestLeft", "className": "Part", "shape": "Block", "size": [0.8, 1.6, 3.2], "pos": [-2.9, 1.6, 0], "mat": "Fabric", "col": [40, 50, 70]},
            {"name": "ArmrestRight", "className": "Part", "shape": "Block", "size": [0.8, 1.6, 3.2], "pos": [2.9, 1.6, 0], "mat": "Fabric", "col": [40, 50, 70]},
            {"name": "SeatCushionLeft", "className": "Part", "shape": "Block", "size": [2.4, 0.5, 2.4], "pos": [-1.3, 1.25, 0.3], "mat": "Fabric", "col": [55, 68, 92]}
        ]
    },

    # Vehicles
    {
        "name": "MainBattleTank",
        "category": "vehicles",
        "keywords": ["tank", "battle tank", "military tank", "armored vehicle"],
        "parts": [
            {"name": "TankHull", "className": "Part", "shape": "Block", "size": [5.2, 1.6, 7.4], "pos": [0, 1.4, 0], "mat": "Metal", "col": [75, 85, 65]},
            {"name": "TreadLeft", "className": "Part", "shape": "Block", "size": [1.2, 1.4, 8.0], "pos": [-2.9, 1.1, 0], "mat": "DiamondPlate", "col": [35, 35, 40]},
            {"name": "TreadRight", "className": "Part", "shape": "Block", "size": [1.2, 1.4, 8.0], "pos": [2.9, 1.1, 0], "mat": "DiamondPlate", "col": [35, 35, 40]},
            {"name": "RotatingTurret", "className": "Part", "shape": "Block", "size": [3.4, 1.2, 3.8], "pos": [0, 2.7, -0.4], "mat": "Metal", "col": [75, 85, 65]},
            {"name": "MainCannonBarrel", "className": "Part", "shape": "Cylinder", "size": [0.55, 0.55, 5.4], "pos": [0, 2.8, 3.8], "mat": "Metal", "col": [55, 60, 50]}
        ]
    },
    {
        "name": "SupersonicJet",
        "category": "vehicles",
        "keywords": ["fighter jet", "airplane", "supersonic jet", "aircraft"],
        "parts": [
            {"name": "MainFuselage", "className": "Part", "shape": "Block", "size": [1.8, 1.4, 9.6], "pos": [0, 2.0, 0], "mat": "Metal", "col": [190, 195, 205]},
            {"name": "NoseCone", "className": "WedgePart", "shape": "Wedge", "size": [1.8, 1.2, 2.8], "pos": [0, 1.9, 5.8], "mat": "SmoothPlastic", "col": [45, 50, 60]},
            {"name": "WingLeft", "className": "Part", "shape": "Block", "size": [4.6, 0.15, 3.8], "pos": [-3.0, 1.9, -0.6], "mat": "Metal", "col": [190, 195, 205]},
            {"name": "WingRight", "className": "Part", "shape": "Block", "size": [4.6, 0.15, 3.8], "pos": [3.0, 1.9, -0.6], "mat": "Metal", "col": [190, 195, 205]},
            {"name": "CockpitCanopy", "className": "Part", "shape": "Ball", "size": [1.3, 1.2, 3.4], "pos": [0, 2.8, 2.2], "mat": "Glass", "col": [80, 180, 240]}
        ]
    },
    {
        "name": "StylizedBuggy",
        "category": "vehicles",
        "keywords": ["car", "buggy", "off-road car", "vehicle"],
        "parts": [
            {"name": "BuggyChassis", "className": "Part", "shape": "Block", "size": [3.8, 1.2, 6.2], "pos": [0, 1.6, 0], "mat": "Metal", "col": [220, 50, 45]},
            {"name": "VehicleCabin", "className": "Part", "shape": "Block", "size": [3.4, 1.8, 3.2], "pos": [0, 3.3, -0.2], "mat": "Metal", "col": [220, 50, 45]},
            {"name": "CabinWindshield", "className": "Part", "shape": "Block", "size": [3.4, 1.4, 0.25], "pos": [0, 3.4, 1.45], "mat": "Glass", "col": [140, 210, 245]},
            {"name": "AllTerrainTire_FL", "className": "Part", "shape": "Cylinder", "size": [0.9, 1.8, 1.8], "pos": [-2.1, 0.9, 1.9], "mat": "SmoothPlastic", "col": [30, 30, 35]},
            {"name": "AllTerrainTire_FR", "className": "Part", "shape": "Cylinder", "size": [0.9, 1.8, 1.8], "pos": [2.1, 0.9, 1.9], "mat": "SmoothPlastic", "col": [30, 30, 35]}
        ]
    },

    # Architecture
    {
        "name": "WatchtowerPost",
        "category": "buildings",
        "keywords": ["tower", "watchtower", "guard tower", "lighthouse"],
        "parts": [
            {"name": "TowerPlinthBase", "className": "Part", "shape": "Cylinder", "size": [6.4, 1.2, 6.4], "pos": [0, 0.6, 0], "mat": "Cobblestone", "col": [95, 100, 105]},
            {"name": "TowerStoneShaft", "className": "Part", "shape": "Cylinder", "size": [5.2, 10.4, 5.2], "pos": [0, 6.4, 0], "mat": "Cobblestone", "col": [115, 120, 125]},
            {"name": "BattlementDeck", "className": "Part", "shape": "Cylinder", "size": [6.8, 1.0, 6.8], "pos": [0, 12.1, 0], "mat": "Cobblestone", "col": [95, 100, 105]},
            {"name": "ReinforcedDoor", "className": "Part", "shape": "Block", "size": [1.8, 3.2, 0.4], "pos": [0, 2.2, 2.5], "mat": "WoodPlanks", "col": [90, 55, 30]}
        ]
    },
    {
        "name": "MedievalCottage",
        "category": "buildings",
        "keywords": ["house", "cottage", "cabin", "building"],
        "parts": [
            {"name": "FoundationPlinth", "className": "Part", "shape": "Block", "size": [8.8, 0.8, 7.2], "pos": [0, 0.4, 0], "mat": "Cobblestone", "col": [95, 100, 105]},
            {"name": "MainLivingWalls", "className": "Part", "shape": "Block", "size": [8.2, 5.0, 6.6], "pos": [0, 3.3, 0], "mat": "Brick", "col": [160, 145, 130]},
            {"name": "GabledRoofLeft", "className": "WedgePart", "shape": "Wedge", "size": [3.8, 2.4, 7.2], "pos": [-2.1, 7.0, 0], "mat": "Slate", "col": [140, 55, 45]},
            {"name": "GabledRoofRight", "className": "WedgePart", "shape": "Wedge", "size": [3.8, 2.4, 7.2], "pos": [2.1, 7.0, 0], "mat": "Slate", "col": [140, 55, 45]},
            {"name": "FrontDoor", "className": "Part", "shape": "Block", "size": [1.8, 3.4, 0.3], "pos": [-1.4, 2.5, 3.45], "mat": "WoodPlanks", "col": [110, 65, 35]}
        ]
    },

    # Additional Domain Assets
    {
        "name": "MarbleFountain",
        "category": "props",
        "keywords": ["fountain", "stone fountain", "water fountain", "marble fountain"],
        "parts": [
            {"name": "MarbleBasinBase", "className": "Part", "shape": "Cylinder", "size": [8.4, 1.2, 8.4], "pos": [0, 0.6, 0], "mat": "Marble", "col": [225, 225, 230]},
            {"name": "BasinWaterSurface", "className": "Part", "shape": "Cylinder", "size": [7.6, 0.2, 7.6], "pos": [0, 1.15, 0], "mat": "Glass", "col": [60, 170, 245]},
            {"name": "PedestalColumn", "className": "Part", "shape": "Cylinder", "size": [2.2, 3.4, 2.2], "pos": [0, 2.3, 0], "mat": "Marble", "col": [215, 215, 220]},
            {"name": "SpoutingWaterJet", "className": "Part", "shape": "Cylinder", "size": [0.6, 2.8, 0.6], "pos": [0, 5.4, 0], "mat": "Neon", "col": [140, 225, 255]}
        ]
    },
    {
        "name": "BlacksmithAnvil",
        "category": "props",
        "keywords": ["anvil", "blacksmith anvil", "forge anvil"],
        "parts": [
            {"name": "LogStand", "className": "Part", "shape": "Cylinder", "size": [2.8, 1.6, 2.8], "pos": [0, 0.8, 0], "mat": "Wood", "col": [90, 55, 30]},
            {"name": "AnvilWaist", "className": "Part", "shape": "Block", "size": [1.6, 1.2, 1.2], "pos": [0, 2.2, 0], "mat": "Metal", "col": [45, 48, 55]},
            {"name": "StrikingFace", "className": "Part", "shape": "Block", "size": [3.4, 0.8, 1.4], "pos": [-0.2, 3.2, 0], "mat": "Metal", "col": [55, 60, 68]},
            {"name": "RoundHornTip", "className": "WedgePart", "shape": "Wedge", "size": [1.6, 0.8, 1.4], "pos": [2.1, 3.2, 0], "mat": "Metal", "col": [55, 60, 68]}
        ]
    },
    {
        "name": "IronSiegeCannon",
        "category": "weapons",
        "keywords": ["cannon", "siege cannon", "pirate cannon", "artillery"],
        "parts": [
            {"name": "CarriageTruckBed", "className": "Part", "shape": "Block", "size": [2.6, 1.2, 4.4], "pos": [0, 1.2, 0], "mat": "WoodPlanks", "col": [95, 60, 32]},
            {"name": "IronCannonBarrel", "className": "Part", "shape": "Cylinder", "size": [1.2, 5.8, 1.2], "pos": [0, 2.4, 0.6], "mat": "Metal", "col": [40, 44, 50]},
            {"name": "TruckWheel_FL", "className": "Part", "shape": "Cylinder", "size": [0.55, 1.8, 1.8], "pos": [-1.5, 0.9, 1.4], "mat": "Wood", "col": [80, 50, 28]},
            {"name": "TruckWheel_FR", "className": "Part", "shape": "Cylinder", "size": [0.55, 1.8, 1.8], "pos": [1.5, 0.9, 1.4], "mat": "Wood", "col": [80, 50, 28]}
        ]
    },
    {
        "name": "WitchBrewCauldron",
        "category": "props",
        "keywords": ["cauldron", "witch cauldron", "potion pot", "brewing pot"],
        "parts": [
            {"name": "CastIronPotBody", "className": "Part", "shape": "Ball", "size": [3.8, 3.2, 3.8], "pos": [0, 2.1, 0], "mat": "Metal", "col": [35, 38, 45]},
            {"name": "CauldronRim", "className": "Part", "shape": "Cylinder", "size": [3.4, 0.45, 3.4], "pos": [0, 3.6, 0], "mat": "Metal", "col": [45, 48, 55]},
            {"name": "ArcaneBrewSurface", "className": "Part", "shape": "Cylinder", "size": [3.0, 0.15, 3.0], "pos": [0, 3.45, 0], "mat": "Neon", "col": [40, 255, 100]}
        ]
    },
    {
        "name": "RoyalGoldenCrown",
        "category": "props",
        "keywords": ["crown", "golden crown", "king crown", "royal tiara"],
        "parts": [
            {"name": "GoldCircletBand", "className": "Part", "shape": "Cylinder", "size": [3.2, 0.8, 3.2], "pos": [0, 0.4, 0], "mat": "Metal", "col": [240, 200, 50]},
            {"name": "CrimsonVelvetCap", "className": "Part", "shape": "Ball", "size": [2.8, 1.6, 2.8], "pos": [0, 0.8, 0], "mat": "Fabric", "col": [160, 30, 45]},
            {"name": "FrontInsigniaSapphire", "className": "Part", "shape": "Ball", "size": [0.45, 0.45, 0.45], "pos": [0, 0.4, 1.65], "mat": "Neon", "col": [0, 180, 255]}
        ]
    },

    # Characters & Zombies (Crucial Domain Blueprints)
    {
        "name": "BusinessZombieWithBriefcase",
        "category": "characters",
        "keywords": ["zombie", "business zombie", "zombie in suit", "briefcase", "infected businessman", "office zombie", "zombie holding a briefcase", "shredded suit zombie"],
        "parts": [
            {"name": "Torso", "className": "Part", "shape": "Block", "size": [2.0, 2.0, 1.0], "pos": [0, 3.0, 0], "mat": "Fabric", "col": [45, 48, 55]},
            {"name": "Undershirt", "className": "Part", "shape": "Block", "size": [0.8, 1.5, 0.15], "pos": [0, 3.2, 0.52], "mat": "Fabric", "col": [220, 225, 220]},
            {"name": "TornNecktie", "className": "Part", "shape": "Block", "size": [0.25, 1.2, 0.12], "pos": [0.05, 3.1, 0.6], "mat": "Fabric", "col": [175, 40, 40]},
            {"name": "SuitLapelLeft", "className": "Part", "shape": "Block", "size": [0.4, 1.6, 0.12], "pos": [-0.55, 3.2, 0.55], "mat": "Fabric", "col": [38, 40, 48]},
            {"name": "SuitLapelRight", "className": "Part", "shape": "Block", "size": [0.4, 1.6, 0.12], "pos": [0.55, 3.2, 0.55], "mat": "Fabric", "col": [38, 40, 48]},
            {"name": "LeatherBelt", "className": "Part", "shape": "Block", "size": [2.05, 0.25, 1.05], "pos": [0, 2.1, 0], "mat": "SmoothPlastic", "col": [30, 25, 22]},
            {"name": "BrassBuckle", "className": "Part", "shape": "Block", "size": [0.35, 0.3, 0.12], "pos": [0, 2.1, 0.55], "mat": "Metal", "col": [215, 175, 55]},
            {"name": "Head", "className": "Part", "shape": "Block", "size": [1.2, 1.2, 1.2], "pos": [0, 4.6, 0.05], "mat": "SmoothPlastic", "col": [85, 125, 75]},
            {"name": "LeftEye", "className": "Part", "shape": "Block", "size": [0.24, 0.24, 0.1], "pos": [-0.3, 4.75, 0.65], "mat": "Neon", "col": [255, 50, 40]},
            {"name": "RightEye", "className": "Part", "shape": "Block", "size": [0.22, 0.22, 0.1], "pos": [0.3, 4.65, 0.65], "mat": "SmoothPlastic", "col": [230, 215, 110]},
            {"name": "ZombieJaw", "className": "Part", "shape": "Block", "size": [0.65, 0.22, 0.12], "pos": [0, 4.22, 0.65], "mat": "SmoothPlastic", "col": [35, 25, 20]},
            {"name": "LeftArm", "className": "Part", "shape": "Block", "size": [1.0, 2.0, 1.0], "pos": [-1.5, 3.1, 0.8], "mat": "SmoothPlastic", "col": [85, 125, 75]},
            {"name": "TornSleeveLeft", "className": "Part", "shape": "Block", "size": [1.1, 1.2, 1.1], "pos": [-1.5, 3.4, 0.4], "mat": "Fabric", "col": [45, 48, 55]},
            {"name": "RightArm", "className": "Part", "shape": "Block", "size": [1.0, 2.0, 1.0], "pos": [1.5, 2.8, 0.2], "mat": "SmoothPlastic", "col": [85, 125, 75]},
            {"name": "TornSleeveRight", "className": "Part", "shape": "Block", "size": [1.1, 1.3, 1.1], "pos": [1.5, 3.1, 0.1], "mat": "Fabric", "col": [45, 48, 55]},
            {"name": "Briefcase", "className": "Part", "shape": "Block", "size": [0.6, 1.8, 2.4], "pos": [1.8, 1.4, 0.5], "mat": "WoodPlanks", "col": [85, 45, 25]},
            {"name": "BriefcaseHandle", "className": "Part", "shape": "Cylinder", "size": [0.15, 0.8, 0.15], "pos": [1.8, 2.35, 0.5], "mat": "Metal", "col": [215, 175, 55]},
            {"name": "BrassLatchLeft", "className": "Part", "shape": "Block", "size": [0.65, 0.2, 0.3], "pos": [1.8, 1.4, -0.3], "mat": "Metal", "col": [225, 185, 60]},
            {"name": "BrassLatchRight", "className": "Part", "shape": "Block", "size": [0.65, 0.2, 0.3], "pos": [1.8, 1.4, 1.3], "mat": "Metal", "col": [225, 185, 60]},
            {"name": "LeftLeg", "className": "Part", "shape": "Block", "size": [1.0, 2.0, 1.0], "pos": [-0.5, 1.0, 0.1], "mat": "Fabric", "col": [38, 40, 48]},
            {"name": "RightLeg", "className": "Part", "shape": "Block", "size": [1.0, 2.0, 1.0], "pos": [0.5, 1.0, -0.1], "mat": "Fabric", "col": [38, 40, 48]},
            {"name": "LeftShoe", "className": "Part", "shape": "Block", "size": [1.05, 0.4, 1.3], "pos": [-0.5, 0.2, 0.25], "mat": "SmoothPlastic", "col": [20, 18, 18]},
            {"name": "RightShoe", "className": "Part", "shape": "Block", "size": [1.05, 0.4, 1.3], "pos": [0.5, 0.2, 0.05], "mat": "SmoothPlastic", "col": [20, 18, 18]}
        ]
    },
    {
        "name": "ClassicRobloxZombie",
        "category": "characters",
        "keywords": ["zombie", "classic zombie", "green zombie", "undead", "ghoul", "infected zombie", "roblox zombie"],
        "parts": [
            {"name": "Torso", "className": "Part", "shape": "Block", "size": [2.0, 2.0, 1.0], "pos": [0, 3.0, 0], "mat": "Fabric", "col": [60, 95, 100]},
            {"name": "Head", "className": "Part", "shape": "Block", "size": [1.2, 1.2, 1.2], "pos": [0, 4.6, 0.05], "mat": "SmoothPlastic", "col": [92, 150, 58]},
            {"name": "GlowEyeLeft", "className": "Part", "shape": "Block", "size": [0.25, 0.25, 0.1], "pos": [-0.3, 4.7, 0.65], "mat": "Neon", "col": [255, 45, 35]},
            {"name": "EyeRight", "className": "Part", "shape": "Block", "size": [0.22, 0.22, 0.1], "pos": [0.3, 4.65, 0.65], "mat": "SmoothPlastic", "col": [235, 220, 110]},
            {"name": "ZombieSnarl", "className": "Part", "shape": "Block", "size": [0.55, 0.15, 0.1], "pos": [0, 4.22, 0.65], "mat": "SmoothPlastic", "col": [35, 25, 20]},
            {"name": "LeftArm", "className": "Part", "shape": "Block", "size": [1.0, 2.0, 1.0], "pos": [-1.5, 3.1, 0.8], "mat": "SmoothPlastic", "col": [92, 150, 58]},
            {"name": "RightArm", "className": "Part", "shape": "Block", "size": [1.0, 2.0, 1.0], "pos": [1.5, 3.0, 0.8], "mat": "SmoothPlastic", "col": [92, 150, 58]},
            {"name": "LeftLeg", "className": "Part", "shape": "Block", "size": [1.0, 2.0, 1.0], "pos": [-0.5, 1.0, 0], "mat": "Fabric", "col": [42, 48, 65]},
            {"name": "RightLeg", "className": "Part", "shape": "Block", "size": [1.0, 2.0, 1.0], "pos": [0.5, 1.0, 0], "mat": "Fabric", "col": [42, 48, 65]},
            {"name": "ExposedRibcage", "className": "Part", "shape": "Block", "size": [0.7, 0.9, 0.2], "pos": [-0.35, 2.9, 0.52], "mat": "SmoothPlastic", "col": [238, 235, 225]},
            {"name": "ToxicSlimeDrip", "className": "Part", "shape": "Ball", "size": [0.25, 0.35, 0.25], "pos": [0.2, 4.0, 0.65], "mat": "Neon", "col": [80, 255, 40]}
        ]
    },
    {
        "name": "ArmoredPaladinKnight",
        "category": "characters",
        "keywords": ["knight", "paladin", "warrior", "armor", "sword and shield", "soldier", "crusader"],
        "parts": [
            {"name": "Torso", "className": "Part", "shape": "Block", "size": [2.0, 2.0, 1.0], "pos": [0, 3.0, 0], "mat": "Metal", "col": [160, 165, 175]},
            {"name": "SteelBreastplate", "className": "Part", "shape": "Block", "size": [1.8, 1.7, 0.2], "pos": [0, 3.1, 0.55], "mat": "Metal", "col": [190, 195, 205]},
            {"name": "Head", "className": "Part", "shape": "Block", "size": [1.2, 1.2, 1.2], "pos": [0, 4.6, 0], "mat": "Metal", "col": [170, 175, 185]},
            {"name": "HelmVisorSlit", "className": "Part", "shape": "Block", "size": [0.9, 0.2, 0.15], "pos": [0, 4.65, 0.62], "mat": "SmoothPlastic", "col": [25, 25, 30]},
            {"name": "RoyalRedPlume", "className": "Part", "shape": "Block", "size": [0.3, 0.8, 1.2], "pos": [0, 5.4, -0.2], "mat": "Fabric", "col": [195, 35, 35]},
            {"name": "LeftArm", "className": "Part", "shape": "Block", "size": [1.0, 2.0, 1.0], "pos": [-1.5, 3.0, 0], "mat": "Metal", "col": [150, 155, 165]},
            {"name": "PauldronLeft", "className": "Part", "shape": "Block", "size": [1.3, 0.6, 1.3], "pos": [-1.6, 3.8, 0], "mat": "Metal", "col": [220, 180, 50]},
            {"name": "KnightShield", "className": "Part", "shape": "Block", "size": [2.2, 3.0, 0.25], "pos": [-1.8, 2.8, 0.8], "mat": "WoodPlanks", "col": [180, 40, 40]},
            {"name": "RightArm", "className": "Part", "shape": "Block", "size": [1.0, 2.0, 1.0], "pos": [1.5, 3.0, 0], "mat": "Metal", "col": [150, 155, 165]},
            {"name": "PauldronRight", "className": "Part", "shape": "Block", "size": [1.3, 0.6, 1.3], "pos": [1.6, 3.8, 0], "mat": "Metal", "col": [220, 180, 50]},
            {"name": "SwordHilt", "className": "Part", "shape": "Cylinder", "size": [0.3, 1.2, 0.3], "pos": [1.6, 2.0, 0.8], "mat": "Fabric", "col": [90, 55, 35]},
            {"name": "SwordCrossguard", "className": "Part", "shape": "Block", "size": [1.4, 0.25, 0.4], "pos": [1.6, 2.4, 1.2], "mat": "Metal", "col": [220, 180, 50]},
            {"name": "SwordBlade", "className": "Part", "shape": "Block", "size": [0.45, 3.6, 0.12], "pos": [1.6, 3.8, 2.4], "mat": "Metal", "col": [225, 230, 240]},
            {"name": "LeftLeg", "className": "Part", "shape": "Block", "size": [1.0, 2.0, 1.0], "pos": [-0.5, 1.0, 0], "mat": "Metal", "col": [140, 145, 155]},
            {"name": "RightLeg", "className": "Part", "shape": "Block", "size": [1.0, 2.0, 1.0], "pos": [0.5, 1.0, 0], "mat": "Metal", "col": [140, 145, 155]}
        ]
    },
    {
        "name": "MagicCrystalCore",
        "category": "props",
        "keywords": ["crystal", "magic crystal", "core", "energy core", "floating crystal", "runic crystal", "gem"],
        "parts": [
            {"name": "StonePedestal", "className": "Part", "shape": "Cylinder", "size": [3.6, 1.4, 3.6], "pos": [0, 0.7, 0], "mat": "Cobblestone", "col": [90, 92, 98]},
            {"name": "RunicGlowRing", "className": "Part", "shape": "Cylinder", "size": [3.4, 0.05, 3.4], "pos": [0, 1.43, 0], "mat": "Neon", "col": [0, 240, 255]},
            {"name": "CentralCrystal", "className": "Part", "shape": "Block", "size": [1.8, 3.4, 1.8], "pos": [0, 4.2, 0], "mat": "Neon", "col": [0, 230, 255]},
            {"name": "OrbitShardTop", "className": "Part", "shape": "Block", "size": [0.6, 1.4, 0.6], "pos": [1.6, 4.8, 1.0], "mat": "Neon", "col": [160, 60, 255]},
            {"name": "OrbitShardBottom", "className": "Part", "shape": "Block", "size": [0.6, 1.2, 0.6], "pos": [-1.4, 3.2, -1.2], "mat": "Neon", "col": [160, 60, 255]},
            {"name": "ContainmentRing", "className": "Part", "shape": "Cylinder", "size": [4.4, 0.25, 4.4], "pos": [0, 4.2, 0], "mat": "Metal", "col": [235, 185, 45]}
        ]
    },
    {
        "name": "RoyalVelvetArmchair",
        "category": "furniture",
        "keywords": ["armchair", "throne", "chair", "velvet chair", "royal seat", "furniture"],
        "parts": [
            {"name": "SeatFrame", "className": "Part", "shape": "Block", "size": [2.8, 0.4, 2.6], "pos": [0, 1.4, 0], "mat": "WoodPlanks", "col": [80, 50, 30]},
            {"name": "VelvetCushion", "className": "Part", "shape": "Block", "size": [2.5, 0.6, 2.3], "pos": [0, 1.8, 0.05], "mat": "Fabric", "col": [160, 25, 35]},
            {"name": "BackrestPanel", "className": "Part", "shape": "Block", "size": [2.8, 3.2, 0.4], "pos": [0, 3.3, -1.2], "mat": "Fabric", "col": [160, 25, 35]},
            {"name": "BackrestGoldCrest", "className": "Part", "shape": "Ball", "size": [0.8, 0.8, 0.6], "pos": [0, 5.0, -1.3], "mat": "Metal", "col": [225, 185, 45]},
            {"name": "ArmrestLeft", "className": "Part", "shape": "Block", "size": [0.4, 1.2, 2.4], "pos": [-1.4, 2.3, 0], "mat": "Wood", "col": [90, 55, 35]},
            {"name": "ArmrestRight", "className": "Part", "shape": "Block", "size": [0.4, 1.2, 2.4], "pos": [1.4, 2.3, 0], "mat": "Wood", "col": [90, 55, 35]},
            {"name": "Leg_FL", "className": "Part", "shape": "Cylinder", "size": [0.35, 1.3, 0.35], "pos": [-1.2, 0.65, 1.1], "mat": "Wood", "col": [80, 50, 30]},
            {"name": "Leg_FR", "className": "Part", "shape": "Cylinder", "size": [0.35, 1.3, 0.35], "pos": [1.2, 0.65, 1.1], "mat": "Wood", "col": [80, 50, 30]}
        ]
    }
]

# 10 Real Roblox Animation Sequences with joint keyframe poses
ANIMATION_BLUEPRINTS = [
    {
        "name": "CharacterWaveAnimation",
        "keywords": ["wave", "waving hand", "friendly greeting wave", "hello wave"],
        "length": 1.8,
        "loop": True,
        "priority": "Action",
        "keyframes": [
            {"time": 0.0, "poses": [{"boneName": "RightUpperArm", "pos": [1.5, 3.0, 0], "rot": [0, 0, 0]}, {"boneName": "Head", "pos": [0, 4.5, 0], "rot": [0, 0, 0]}]},
            {"time": 0.4, "poses": [{"boneName": "RightUpperArm", "pos": [1.5, 3.2, 0], "rot": [0, 0, 130]}, {"boneName": "Head", "pos": [0, 4.5, 0], "rot": [0, -10, 5]}]},
            {"time": 0.9, "poses": [{"boneName": "RightUpperArm", "pos": [1.5, 3.2, 0], "rot": [0, 0, 95]}, {"boneName": "Head", "pos": [0, 4.5, 0], "rot": [0, 10, -5]}]},
            {"time": 1.4, "poses": [{"boneName": "RightUpperArm", "pos": [1.5, 3.2, 0], "rot": [0, 0, 130]}, {"boneName": "Head", "pos": [0, 4.5, 0], "rot": [0, -10, 5]}]},
            {"time": 1.8, "poses": [{"boneName": "RightUpperArm", "pos": [1.5, 3.0, 0], "rot": [0, 0, 0]}, {"boneName": "Head", "pos": [0, 4.5, 0], "rot": [0, 0, 0]}]}
        ]
    },
    {
        "name": "HumanoidWalkCycle",
        "keywords": ["walk cycle", "walk animation", "walking movement", "run walk"],
        "length": 1.0,
        "loop": True,
        "priority": "Movement",
        "keyframes": [
            {"time": 0.0, "poses": [{"boneName": "LeftLeg", "pos": [-0.5, 1.0, 0.4], "rot": [25, 0, 0]}, {"boneName": "RightLeg", "pos": [0.5, 1.0, -0.4], "rot": [-25, 0, 0]}]},
            {"time": 0.25, "poses": [{"boneName": "LeftLeg", "pos": [-0.5, 1.2, 0], "rot": [0, 0, 0]}, {"boneName": "RightLeg", "pos": [0.5, 1.0, 0], "rot": [0, 0, 0]}]},
            {"time": 0.5, "poses": [{"boneName": "LeftLeg", "pos": [-0.5, 1.0, -0.4], "rot": [-25, 0, 0]}, {"boneName": "RightLeg", "pos": [0.5, 1.0, 0.4], "rot": [25, 0, 0]}]},
            {"time": 0.75, "poses": [{"boneName": "LeftLeg", "pos": [-0.5, 1.0, 0], "rot": [0, 0, 0]}, {"boneName": "RightLeg", "pos": [0.5, 1.2, 0], "rot": [0, 0, 0]}]},
            {"time": 1.0, "poses": [{"boneName": "LeftLeg", "pos": [-0.5, 1.0, 0.4], "rot": [25, 0, 0]}, {"boneName": "RightLeg", "pos": [0.5, 1.0, -0.4], "rot": [-25, 0, 0]}]}
        ]
    },
    {
        "name": "SwordSlashCombo",
        "keywords": ["sword slash", "sword attack", "slash combo", "weapon swing"],
        "length": 0.8,
        "loop": False,
        "priority": "Action",
        "keyframes": [
            {"time": 0.0, "poses": [{"boneName": "Torso", "pos": [0, 3.0, 0], "rot": [0, 30, 0]}, {"boneName": "RightArm", "pos": [1.5, 3.2, 0], "rot": [-45, 45, 0]}]},
            {"time": 0.35, "poses": [{"boneName": "Torso", "pos": [0, 3.0, 0.2], "rot": [10, -50, 0]}, {"boneName": "RightArm", "pos": [1.5, 2.8, 1.2], "rot": [60, -60, 0]}]},
            {"time": 0.8, "poses": [{"boneName": "Torso", "pos": [0, 3.0, 0], "rot": [0, 0, 0]}, {"boneName": "RightArm", "pos": [1.5, 3.0, 0], "rot": [0, 0, 0]}]}
        ]
    },
    {
        "name": "ShieldBlockDefense",
        "keywords": ["shield block", "defensive brace", "block animation", "shield guard"],
        "length": 1.2,
        "loop": True,
        "priority": "Action",
        "keyframes": [
            {"time": 0.0, "poses": [{"boneName": "LeftArm", "pos": [-1.5, 3.0, 0], "rot": [0, 0, 0]}]},
            {"time": 0.2, "poses": [{"boneName": "LeftArm", "pos": [-0.6, 3.2, 0.8], "rot": [65, 25, 0]}, {"boneName": "Torso", "pos": [0, 2.9, -0.1], "rot": [-8, 15, 0]}]},
            {"time": 1.2, "poses": [{"boneName": "LeftArm", "pos": [-0.6, 3.2, 0.8], "rot": [65, 25, 0]}, {"boneName": "Torso", "pos": [0, 2.9, -0.1], "rot": [-8, 15, 0]}]}
        ]
    },
    {
        "name": "TreasureChestOpen",
        "keywords": ["chest open", "open treasure chest", "unlid chest", "chest opening"],
        "length": 1.5,
        "loop": False,
        "priority": "Action",
        "keyframes": [
            {"time": 0.0, "poses": [{"boneName": "ChestLid", "pos": [0, 2.6, 0], "rot": [0, 0, 0]}]},
            {"time": 0.5, "poses": [{"boneName": "ChestLid", "pos": [0, 2.7, -0.4], "rot": [-45, 0, 0]}]},
            {"time": 1.0, "poses": [{"boneName": "ChestLid", "pos": [0, 2.8, -1.0], "rot": [-105, 0, 0]}]},
            {"time": 1.5, "poses": [{"boneName": "ChestLid", "pos": [0, 2.8, -1.0], "rot": [-105, 0, 0]}]}
        ]
    },
    {
        "name": "ZombieShambleWalk",
        "keywords": ["zombie walk", "zombie shamble", "undead walk", "creepy shamble", "infected walk", "zombie animation"],
        "length": 1.8,
        "loop": True,
        "priority": "Movement",
        "keyframes": [
            {
                "time": 0.0,
                "poses": [
                    {"boneName": "LeftArm", "pos": [-1.5, 3.1, 0.8], "rot": [85, 8, -5]},
                    {"boneName": "RightArm", "pos": [1.5, 3.0, 0.8], "rot": [92, -6, 4]},
                    {"boneName": "Head", "pos": [0, 4.6, 0.05], "rot": [6, 12, -8]},
                    {"boneName": "LeftLeg", "pos": [-0.5, 1.0, 0.2], "rot": [18, 0, 0]},
                    {"boneName": "RightLeg", "pos": [0.5, 1.0, -0.2], "rot": [-16, 0, 0]},
                    {"boneName": "Torso", "pos": [0, 2.95, 0], "rot": [8, 4, -3]}
                ]
            },
            {
                "time": 0.9,
                "poses": [
                    {"boneName": "LeftArm", "pos": [-1.5, 3.1, 0.8], "rot": [95, 5, -4]},
                    {"boneName": "RightArm", "pos": [1.5, 3.0, 0.8], "rot": [84, -8, 3]},
                    {"boneName": "Head", "pos": [0, 4.6, 0.05], "rot": [4, 15, -10]},
                    {"boneName": "LeftLeg", "pos": [-0.5, 1.0, -0.2], "rot": [-18, 0, 0]},
                    {"boneName": "RightLeg", "pos": [0.5, 1.0, 0.2], "rot": [16, 0, 0]},
                    {"boneName": "Torso", "pos": [0, 3.05, 0], "rot": [6, -3, 2]}
                ]
            },
            {
                "time": 1.8,
                "poses": [
                    {"boneName": "LeftArm", "pos": [-1.5, 3.1, 0.8], "rot": [85, 8, -5]},
                    {"boneName": "RightArm", "pos": [1.5, 3.0, 0.8], "rot": [92, -6, 4]},
                    {"boneName": "Head", "pos": [0, 4.6, 0.05], "rot": [6, 12, -8]},
                    {"boneName": "LeftLeg", "pos": [-0.5, 1.0, 0.2], "rot": [18, 0, 0]},
                    {"boneName": "RightLeg", "pos": [0.5, 1.0, -0.2], "rot": [-16, 0, 0]},
                    {"boneName": "Torso", "pos": [0, 2.95, 0], "rot": [8, 4, -3]}
                ]
            }
        ]
    },
    {
        "name": "ZombieLungeAttack",
        "keywords": ["zombie attack", "zombie lunge", "undead bite", "zombie claw attack", "zombie bite"],
        "length": 1.2,
        "loop": False,
        "priority": "Action",
        "keyframes": [
            {
                "time": 0.0,
                "poses": [
                    {"boneName": "Torso", "pos": [0, 3.0, 0], "rot": [-5, 0, 0]},
                    {"boneName": "LeftArm", "pos": [-1.5, 3.0, 0], "rot": [60, 0, 0]},
                    {"boneName": "RightArm", "pos": [1.5, 3.0, 0], "rot": [60, 0, 0]},
                    {"boneName": "Head", "pos": [0, 4.6, 0], "rot": [-10, 0, 0]}
                ]
            },
            {
                "time": 0.5,
                "poses": [
                    {"boneName": "Torso", "pos": [0, 2.8, 0.6], "rot": [30, 0, 0]},
                    {"boneName": "LeftArm", "pos": [-1.3, 3.1, 1.2], "rot": [110, -20, 0]},
                    {"boneName": "RightArm", "pos": [1.3, 3.1, 1.2], "rot": [110, 20, 0]},
                    {"boneName": "Head", "pos": [0, 4.5, 0.7], "rot": [25, 0, 0]}
                ]
            },
            {
                "time": 1.2,
                "poses": [
                    {"boneName": "Torso", "pos": [0, 3.0, 0], "rot": [0, 0, 0]},
                    {"boneName": "LeftArm", "pos": [-1.5, 3.0, 0.5], "rot": [85, 0, 0]},
                    {"boneName": "RightArm", "pos": [1.5, 3.0, 0.5], "rot": [85, 0, 0]},
                    {"boneName": "Head", "pos": [0, 4.6, 0], "rot": [5, 0, 0]}
                ]
            }
        ]
    }
]

PROMPT_PREFIXES = [
    "Create a stylized low-poly",
    "Generate a production-ready Roblox",
    "Build a detailed Roblox Studio",
    "Design a clean game-ready",
    "Construct a modular",
    "Synthesize a stylized",
]

PROMPT_SUFFIXES = [
    "with clean geometry and Roblox materials.",
    "suitable for adventure and RPG games in Roblox Studio.",
    "using properly proportioned Parts and accurate transforms.",
    "with vibrant colors and stylized Roblox aesthetics.",
    "ready for instant export to .rbxmx or .rbxm.",
]

def make_model_ir(bp: Dict[str, Any], variant: int) -> Dict[str, Any]:
    instances = []
    for i, p in enumerate(bp["parts"]):
        part_id = f"p_{bp['name'].lower()}_{i}"
        instances.append({
            "id": part_id,
            "name": p["name"],
            "className": p["className"],
            "shape": p.get("shape", "Block"),
            "size": p["size"],
            "position": p["pos"],
            "rotation": [0, 0, 0],
            "color": p["col"],
            "material": p["mat"],
            "anchored": True,
            "canCollide": True
        })
    return {
        "assetType": "model",
        "name": bp["name"],
        "primaryPartId": instances[0]["id"] if instances else "p_root",
        "instances": instances
    }

def make_anim_ir(bp: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "assetType": "animation",
        "name": bp["name"],
        "length": bp["length"],
        "loop": bp["loop"],
        "priority": bp["priority"],
        "keyframes": [
            {
                "time": kf["time"],
                "easingStyle": "Sine",
                "easingDirection": "InOut",
                "poses": [
                    {
                        "boneName": pose["boneName"],
                        "position": pose["pos"],
                        "rotation": pose["rot"]
                    }
                    for pose in kf["poses"]
                ]
            }
            for kf in bp["keyframes"]
        ]
    }

def generate_sample(sample_id: int) -> Dict[str, Any]:
    # 70% 3D Models, 30% Animations
    is_animation = (random.random() < 0.30)

    if is_animation:
        bp = random.choice(ANIMATION_BLUEPRINTS)
        kw = random.choice(bp["keywords"])
        prefix = random.choice(["Animate:", "Create animation:", "Generate keyframes for", "Make Roblox character"])
        prompt = f"{prefix} {kw} {random.choice(PROMPT_SUFFIXES)}"
        target_asset = make_anim_ir(bp)
        task = "animation"
    else:
        bp = random.choice(MODEL_BLUEPRINTS)
        kw = random.choice(bp["keywords"])
        prefix = random.choice(PROMPT_PREFIXES)
        suffix = random.choice(PROMPT_SUFFIXES)
        prompt = f"{prefix} {kw} {suffix}"
        target_asset = make_model_ir(bp, variant=sample_id)
        task = "model"

    system_instruction = (
        "You are Roblox Asset AI, an ultra-specialized 3D model and animation generation engine "
        "for Roblox Studio. Output valid Roblox Intermediate Representation (IR) JSON only. "
        "Do NOT provide conversation, pleasantries, explanations, or general code. Strictly valid JSON."
    )

    # Standard Chat Instruction Format (for modern SFTTrainer / Unsloth)
    chat_sample = {
        "id": f"roblox_sft_{sample_id}",
        "task": task,
        "prompt": prompt,
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": f"Task: {task} | Request: {prompt}"},
            {"role": "assistant", "content": json.dumps(target_asset, indent=2)}
        ],
        "targetAsset": target_asset
    }

    return chat_sample

def main():
    dataset_dir = os.path.join(os.path.dirname(__file__), "..", "dataset")
    os.makedirs(dataset_dir, exist_ok=True)

    train_path = os.path.join(dataset_dir, "roblox_assets_train.jsonl")
    val_path = os.path.join(dataset_dir, "roblox_assets_val.jsonl")
    sft_train_path = os.path.join(dataset_dir, "roblox_sft_train.jsonl")
    sft_val_path = os.path.join(dataset_dir, "roblox_sft_val.jsonl")

    num_train = 2000
    num_val = 250

    print("================================================================")
    print("      ROBLOX ASSET AI - DOMAIN DATASET SYNTHESIS PIPELINE       ")
    print("================================================================")
    print(f"Generating {num_train} specialized training samples...")

    with open(train_path, "w", encoding="utf-8") as f_train, \
         open(sft_train_path, "w", encoding="utf-8") as f_sft_train:
        for i in range(num_train):
            sample = generate_sample(i)
            # Legacy format for backward compatibility
            legacy_sample = {
                "id": sample["id"],
                "taskType": f"text_to_{sample['task']}",
                "prompt": sample["prompt"],
                "targetAsset": sample["targetAsset"]
            }
            f_train.write(json.dumps(legacy_sample) + "\n")
            # Modern SFT chat format for Kaggle LLM fine-tuning
            f_sft_train.write(json.dumps(sample) + "\n")

    print(f"Generating {num_val} specialized validation samples...")
    with open(val_path, "w", encoding="utf-8") as f_val, \
         open(sft_val_path, "w", encoding="utf-8") as f_sft_val:
        for i in range(num_val):
            sample = generate_sample(10000 + i)
            legacy_sample = {
                "id": sample["id"],
                "taskType": f"text_to_{sample['task']}",
                "prompt": sample["prompt"],
                "targetAsset": sample["targetAsset"]
            }
            f_val.write(json.dumps(legacy_sample) + "\n")
            f_sft_val.write(json.dumps(sample) + "\n")

    print(f"\n[Dataset Complete]")
    print(f"  - Train JSONL:     {train_path} ({os.path.getsize(train_path) // 1024} KB)")
    print(f"  - SFT Train Chat:  {sft_train_path} ({os.path.getsize(sft_train_path) // 1024} KB)")
    print(f"  - Val JSONL:       {val_path} ({os.path.getsize(val_path) // 1024} KB)")
    print(f"  - SFT Val Chat:    {sft_val_path} ({os.path.getsize(sft_val_path) // 1024} KB)")
    print("================================================================")

if __name__ == "__main__":
    main()
