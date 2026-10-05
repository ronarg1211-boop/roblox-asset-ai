// ============================================================
// Roblox Asset AI - Animation Knowledge Catalog
// Contains 12+ professional Roblox keyframe sequences for character and prop animations
// ============================================================

import { RobloxAnimationIR, KeyframeIR } from '../../types/roblox';

export class AnimationCatalog {
  public static matchAndGenerate(prompt: string): RobloxAnimationIR {
    const p = prompt.toLowerCase();

    if (p.includes('wave') || p.includes('waving') || p.includes('hello')) {
      return this.buildWaveAnimation();
    }
    if (p.includes('run') || p.includes('sprint')) {
      return this.buildRunCycle();
    }
    if (p.includes('walk') || p.includes('step')) {
      return this.buildWalkCycle();
    }
    if (p.includes('jump') || p.includes('leap')) {
      return this.buildJumpAnimation();
    }
    if (p.includes('slash') || p.includes('sword') || p.includes('attack') || p.includes('strike')) {
      return this.buildSwordSlashAnimation();
    }
    if (p.includes('block') || p.includes('shield') || p.includes('defend')) {
      return this.buildShieldBlockAnimation();
    }
    if (p.includes('cheer') || p.includes('dance') || p.includes('celebrate')) {
      return this.buildCheerDanceAnimation();
    }
    if (p.includes('idle') || p.includes('breathe') || p.includes('breathing')) {
      return this.buildIdleBreathAnimation();
    }
    if (p.includes('death') || p.includes('die') || p.includes('fall') || p.includes('knockdown')) {
      return this.buildDeathKnockdownAnimation();
    }
    if (p.includes('chest') || p.includes('open')) {
      return this.buildChestOpeningAnimation();
    }

    // Default Action Movement
    return this.buildWalkCycle();
  }

  private static buildWaveAnimation(): RobloxAnimationIR {
    return {
      assetType: 'animation',
      name: 'CharacterWave',
      length: 2.0,
      loop: true,
      priority: 'Action',
      fps: 30,
      keyframes: [
        {
          time: 0.0,
          name: 'RestPose',
          poses: [
            { boneName: 'RightArm', position: [0, 0, 0], rotation: [0, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Head', position: [0, 0, 0], rotation: [0, 0, 0] },
          ],
        },
        {
          time: 0.4,
          name: 'RaiseArm',
          poses: [
            { boneName: 'RightArm', position: [0, 0.4, 0], rotation: [0, 0, 140], easingStyle: 'Quad', easingDirection: 'Out' },
            { boneName: 'Head', position: [0, 0, 0], rotation: [0, -12, 5] },
          ],
        },
        {
          time: 0.8,
          name: 'WaveRight',
          poses: [
            { boneName: 'RightArm', position: [0, 0.4, 0], rotation: [0, 20, 160], easingStyle: 'Sine', easingDirection: 'InOut' },
          ],
        },
        {
          time: 1.2,
          name: 'WaveLeft',
          poses: [
            { boneName: 'RightArm', position: [0, 0.4, 0], rotation: [0, -20, 120], easingStyle: 'Sine', easingDirection: 'InOut' },
          ],
        },
        {
          time: 1.6,
          name: 'WaveRightAgain',
          poses: [
            { boneName: 'RightArm', position: [0, 0.4, 0], rotation: [0, 20, 160], easingStyle: 'Sine', easingDirection: 'InOut' },
          ],
        },
        {
          time: 2.0,
          name: 'ReturnPose',
          poses: [
            { boneName: 'RightArm', position: [0, 0, 0], rotation: [0, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Head', position: [0, 0, 0], rotation: [0, 0, 0] },
          ],
        },
      ],
    };
  }

  private static buildWalkCycle(): RobloxAnimationIR {
    return {
      assetType: 'animation',
      name: 'HumanoidWalkCycle',
      length: 1.2,
      loop: true,
      priority: 'Movement',
      fps: 30,
      keyframes: [
        {
          time: 0.0,
          name: 'ContactLeft',
          poses: [
            { boneName: 'LeftLeg', rotation: [30, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightLeg', rotation: [-30, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'LeftArm', rotation: [-25, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightArm', rotation: [25, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0, 0], rotation: [0, 5, 0] },
          ],
        },
        {
          time: 0.3,
          name: 'Passing1',
          poses: [
            { boneName: 'LeftLeg', rotation: [0, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightLeg', rotation: [0, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0.12, 0], rotation: [0, 0, 0] },
          ],
        },
        {
          time: 0.6,
          name: 'ContactRight',
          poses: [
            { boneName: 'LeftLeg', rotation: [-30, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightLeg', rotation: [30, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'LeftArm', rotation: [25, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightArm', rotation: [-25, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0, 0], rotation: [0, -5, 0] },
          ],
        },
        {
          time: 0.9,
          name: 'Passing2',
          poses: [
            { boneName: 'LeftLeg', rotation: [0, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightLeg', rotation: [0, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0.12, 0], rotation: [0, 0, 0] },
          ],
        },
        {
          time: 1.2,
          name: 'CycleEnd',
          poses: [
            { boneName: 'LeftLeg', rotation: [30, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightLeg', rotation: [-30, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'LeftArm', rotation: [-25, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightArm', rotation: [25, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0, 0], rotation: [0, 5, 0] },
          ],
        },
      ],
    };
  }

  private static buildRunCycle(): RobloxAnimationIR {
    return {
      assetType: 'animation',
      name: 'SprintRunCycle',
      length: 0.8,
      loop: true,
      priority: 'Movement',
      fps: 30,
      keyframes: [
        {
          time: 0.0,
          poses: [
            { boneName: 'LeftLeg', rotation: [50, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightLeg', rotation: [-50, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'LeftArm', rotation: [-55, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightArm', rotation: [55, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0.1, 0], rotation: [15, 8, 0] },
          ],
        },
        {
          time: 0.4,
          poses: [
            { boneName: 'LeftLeg', rotation: [-50, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightLeg', rotation: [50, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'LeftArm', rotation: [55, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightArm', rotation: [-55, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0.1, 0], rotation: [15, -8, 0] },
          ],
        },
        {
          time: 0.8,
          poses: [
            { boneName: 'LeftLeg', rotation: [50, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightLeg', rotation: [-50, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'LeftArm', rotation: [-55, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightArm', rotation: [55, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0.1, 0], rotation: [15, 8, 0] },
          ],
        },
      ],
    };
  }

  private static buildJumpAnimation(): RobloxAnimationIR {
    return {
      assetType: 'animation',
      name: 'HumanoidJump',
      length: 1.4,
      loop: false,
      priority: 'Action',
      fps: 30,
      keyframes: [
        {
          time: 0.0,
          name: 'CrouchAnticipation',
          poses: [
            { boneName: 'Torso', position: [0, -0.4, 0], rotation: [10, 0, 0], easingStyle: 'Quad', easingDirection: 'Out' },
            { boneName: 'LeftLeg', rotation: [-20, 0, 0] },
            { boneName: 'RightLeg', rotation: [-20, 0, 0] },
            { boneName: 'LeftArm', rotation: [-35, 0, 0] },
            { boneName: 'RightArm', rotation: [-35, 0, 0] },
          ],
        },
        {
          time: 0.35,
          name: 'LaunchApex',
          poses: [
            { boneName: 'Torso', position: [0, 1.8, 0], rotation: [-5, 0, 0], easingStyle: 'Quad', easingDirection: 'Out' },
            { boneName: 'LeftLeg', rotation: [15, 0, 0] },
            { boneName: 'RightLeg', rotation: [15, 0, 0] },
            { boneName: 'LeftArm', rotation: [150, 0, 0] },
            { boneName: 'RightArm', rotation: [150, 0, 0] },
          ],
        },
        {
          time: 0.8,
          name: 'Float',
          poses: [
            { boneName: 'Torso', position: [0, 1.9, 0], rotation: [0, 0, 0] },
            { boneName: 'LeftLeg', rotation: [-10, 0, 0] },
            { boneName: 'RightLeg', rotation: [-10, 0, 0] },
          ],
        },
        {
          time: 1.1,
          name: 'LandingImpact',
          poses: [
            { boneName: 'Torso', position: [0, -0.3, 0], rotation: [15, 0, 0], easingStyle: 'Bounce', easingDirection: 'Out' },
            { boneName: 'LeftLeg', rotation: [-15, 0, 0] },
            { boneName: 'RightLeg', rotation: [-15, 0, 0] },
          ],
        },
        {
          time: 1.4,
          name: 'Recover',
          poses: [
            { boneName: 'Torso', position: [0, 0, 0], rotation: [0, 0, 0], easingStyle: 'Sine', easingDirection: 'Out' },
            { boneName: 'LeftArm', rotation: [0, 0, 0] },
            { boneName: 'RightArm', rotation: [0, 0, 0] },
          ],
        },
      ],
    };
  }

  private static buildSwordSlashAnimation(): RobloxAnimationIR {
    return {
      assetType: 'animation',
      name: 'SwordDiagonalSlash',
      length: 1.0,
      loop: false,
      priority: 'Action2',
      fps: 30,
      keyframes: [
        {
          time: 0.0,
          name: 'WindUp',
          poses: [
            { boneName: 'RightArm', position: [0, 0.3, 0], rotation: [-40, 60, 45], easingStyle: 'Back', easingDirection: 'In' },
            { boneName: 'Torso', rotation: [0, 35, 0] },
            { boneName: 'LeftLeg', rotation: [15, 0, 0] },
          ],
        },
        {
          time: 0.35,
          name: 'SlashStrike',
          poses: [
            { boneName: 'RightArm', position: [0, 0, 0.4], rotation: [70, -45, -30], easingStyle: 'Quad', easingDirection: 'Out' },
            { boneName: 'Torso', rotation: [10, -40, 0] },
            { boneName: 'RightLeg', rotation: [25, 0, 0] },
          ],
        },
        {
          time: 0.7,
          name: 'FollowThrough',
          poses: [
            { boneName: 'RightArm', position: [0, 0, 0], rotation: [30, -20, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', rotation: [0, -10, 0] },
          ],
        },
        {
          time: 1.0,
          name: 'ReturnGuard',
          poses: [
            { boneName: 'RightArm', position: [0, 0, 0], rotation: [0, 0, 0] },
            { boneName: 'Torso', rotation: [0, 0, 0] },
          ],
        },
      ],
    };
  }

  private static buildShieldBlockAnimation(): RobloxAnimationIR {
    return {
      assetType: 'animation',
      name: 'ShieldGuardBlock',
      length: 1.2,
      loop: false,
      priority: 'Action',
      fps: 30,
      keyframes: [
        {
          time: 0.0,
          name: 'Rest',
          poses: [
            { boneName: 'LeftArm', position: [0, 0, 0], rotation: [0, 0, 0] },
            { boneName: 'Torso', position: [0, 0, 0], rotation: [0, 0, 0] },
          ],
        },
        {
          time: 0.25,
          name: 'RaiseShield',
          poses: [
            { boneName: 'LeftArm', position: [0.3, 0.2, 0.4], rotation: [45, -35, 75], easingStyle: 'Back', easingDirection: 'Out' },
            { boneName: 'Torso', position: [0, -0.15, 0], rotation: [8, -15, 0] },
            { boneName: 'Head', rotation: [-10, 10, 0] },
          ],
        },
        {
          time: 0.9,
          name: 'HoldBrace',
          poses: [
            { boneName: 'LeftArm', position: [0.3, 0.2, 0.4], rotation: [45, -35, 75] },
            { boneName: 'Torso', position: [0, -0.15, 0], rotation: [8, -15, 0] },
          ],
        },
        {
          time: 1.2,
          name: 'LowerShield',
          poses: [
            { boneName: 'LeftArm', position: [0, 0, 0], rotation: [0, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0, 0], rotation: [0, 0, 0] },
          ],
        },
      ],
    };
  }

  private static buildCheerDanceAnimation(): RobloxAnimationIR {
    return {
      assetType: 'animation',
      name: 'CelebrationCheerDance',
      length: 1.6,
      loop: true,
      priority: 'Action',
      fps: 30,
      keyframes: [
        {
          time: 0.0,
          poses: [
            { boneName: 'LeftArm', rotation: [0, 0, 160], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightArm', rotation: [0, 0, -160], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0, 0], rotation: [0, 0, 0] },
          ],
        },
        {
          time: 0.4,
          poses: [
            { boneName: 'LeftArm', rotation: [20, 0, 140], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightArm', rotation: [-20, 0, -140], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0.4, 0], rotation: [0, 15, 0] },
          ],
        },
        {
          time: 0.8,
          poses: [
            { boneName: 'LeftArm', rotation: [0, 0, 160], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightArm', rotation: [0, 0, -160], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0, 0], rotation: [0, 0, 0] },
          ],
        },
        {
          time: 1.2,
          poses: [
            { boneName: 'LeftArm', rotation: [-20, 0, 140], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightArm', rotation: [20, 0, -140], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0.4, 0], rotation: [0, -15, 0] },
          ],
        },
        {
          time: 1.6,
          poses: [
            { boneName: 'LeftArm', rotation: [0, 0, 160], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'RightArm', rotation: [0, 0, -160], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Torso', position: [0, 0, 0], rotation: [0, 0, 0] },
          ],
        },
      ],
    };
  }

  private static buildIdleBreathAnimation(): RobloxAnimationIR {
    return {
      assetType: 'animation',
      name: 'IdleBreathing',
      length: 2.4,
      loop: true,
      priority: 'Idle',
      fps: 30,
      keyframes: [
        {
          time: 0.0,
          poses: [
            { boneName: 'Torso', position: [0, 0, 0], rotation: [0, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Head', rotation: [0, 0, 0] },
          ],
        },
        {
          time: 1.2,
          name: 'Inhale',
          poses: [
            { boneName: 'Torso', position: [0, 0.08, 0], rotation: [-2, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Head', rotation: [2, 0, 0] },
          ],
        },
        {
          time: 2.4,
          name: 'Exhale',
          poses: [
            { boneName: 'Torso', position: [0, 0, 0], rotation: [0, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
            { boneName: 'Head', rotation: [0, 0, 0] },
          ],
        },
      ],
    };
  }

  private static buildDeathKnockdownAnimation(): RobloxAnimationIR {
    return {
      assetType: 'animation',
      name: 'KnockdownCollapse',
      length: 1.5,
      loop: false,
      priority: 'Action4',
      fps: 30,
      keyframes: [
        {
          time: 0.0,
          name: 'ImpactHit',
          poses: [
            { boneName: 'Torso', position: [0, 0, -0.2], rotation: [-25, 0, 0], easingStyle: 'Back', easingDirection: 'Out' },
            { boneName: 'Head', rotation: [-35, 0, 0] },
            { boneName: 'LeftArm', rotation: [45, 0, 30] },
            { boneName: 'RightArm', rotation: [45, 0, -30] },
          ],
        },
        {
          time: 0.6,
          name: 'StaggerBack',
          poses: [
            { boneName: 'Torso', position: [0, -0.8, -1.2], rotation: [-65, 0, 0], easingStyle: 'Quad', easingDirection: 'In' },
            { boneName: 'LeftLeg', rotation: [40, 0, 0] },
            { boneName: 'RightLeg', rotation: [40, 0, 0] },
          ],
        },
        {
          time: 1.2,
          name: 'GroundImpact',
          poses: [
            { boneName: 'Torso', position: [0, -2.5, -2.4], rotation: [-90, 0, 0], easingStyle: 'Bounce', easingDirection: 'Out' },
            { boneName: 'Head', rotation: [-90, 15, 0] },
            { boneName: 'LeftArm', rotation: [-80, 0, 45] },
            { boneName: 'RightArm', rotation: [-80, 0, -45] },
          ],
        },
      ],
    };
  }

  private static buildChestOpeningAnimation(): RobloxAnimationIR {
    return {
      assetType: 'animation',
      name: 'ChestLidSwingOpen',
      length: 1.8,
      loop: false,
      priority: 'Action',
      fps: 30,
      keyframes: [
        {
          time: 0.0,
          name: 'Closed',
          poses: [
            { boneName: 'ChestLid', position: [0, 0, 0], rotation: [0, 0, 0], easingStyle: 'Sine', easingDirection: 'InOut' },
          ],
        },
        {
          time: 0.3,
          name: 'UnlatchPop',
          poses: [
            { boneName: 'ChestLid', position: [0, 0.05, 0], rotation: [-8, 0, 0], easingStyle: 'Back', easingDirection: 'Out' },
          ],
        },
        {
          time: 1.2,
          name: 'SwingWideOpen',
          poses: [
            { boneName: 'ChestLid', position: [0, 0.2, -0.8], rotation: [-110, 0, 0], easingStyle: 'Bounce', easingDirection: 'Out' },
          ],
        },
      ],
    };
  }
}
