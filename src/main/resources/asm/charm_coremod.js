function initializeCoreMod() {

    var ASM_HOOKS = "svenhjol/charm/base/CharmAsmHooks";
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
    var Opcodes = Java.type('org.objectweb.asm.Opcodes');
    var InsnNode = Java.type('org.objectweb.asm.tree.InsnNode');
    var InsnList = Java.type('org.objectweb.asm.tree.InsnList');
    var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
    var FieldInsnNode = Java.type('org.objectweb.asm.tree.FieldInsnNode');
    var MethodInsnNode = Java.type('org.objectweb.asm.tree.MethodInsnNode');
    var JumpInsnNode = Java.type('org.objectweb.asm.tree.JumpInsnNode');
    var LabelNode = Java.type('org.objectweb.asm.tree.LabelNode');

    return {

        /*
         * BrewingRecipeRegistry: allow potion stacks to be added to brewing stand slots.
         */
        'BrewingRecipeRegistry': {
            target: {
                'type': 'METHOD',
                'class': 'net.minecraftforge.common.brewing.BrewingRecipeRegistry',
                'methodName': 'isValidInput',
                'methodDesc': '(Lnet/minecraft/item/ItemStack;)Z'
            },
            transformer: function(method) {
                var didThing = false;
                var arrayLength = method.instructions.size();
                var newInstructions = new InsnList();
                for (var i = 0; i < arrayLength; ++i) {
                    var instruction = method.instructions.get(i)

                    if (instruction.getOpcode() == Opcodes.IF_ICMPEQ) {
                        var label = new LabelNode();
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                        newInstructions.add(new MethodInsnNode(Opcodes.INVOKESTATIC, ASM_HOOKS, "checkBrewingStandStack", "(Lnet/minecraft/item/ItemStack;)Z", false));
                        newInstructions.add(new JumpInsnNode(Opcodes.IFEQ, label));
                        newInstructions.add(new InsnNode(Opcodes.ICONST_1));
                        newInstructions.add(new InsnNode(Opcodes.IRETURN));
                        newInstructions.add(label);

                        method.instructions.insertBefore(instruction, newInstructions);
                        didThing = true;
                        break;
                    }
                }

                if (didThing) {
                    print("Transformed BrewingRecipeRegistry");
                } else {
                    print("Failed to transform BrewingRecipeRegistry")
                }

                return method;
            }
        },

        /*
         * PotionItem: disable glint
         */
        'PotionItem': {
            target: {
                'type': 'METHOD',
                'class': 'net.minecraft.item.PotionItem',
                'methodName': 'func_77636_d', // hasEffect
                'methodDesc': '(Lnet/minecraft/item/ItemStack;)Z'
            },
            transformer: function(method) {
                var didThing = false;
                var arrayLength = method.instructions.size();
                var newInstructions = new InsnList();
                for (var i = 0; i < arrayLength; ++i) {
                    var instruction = method.instructions.get(i);

                    if (instruction.getOpcode() == Opcodes.ALOAD) {
                        var label = new LabelNode();
                        newInstructions.add(new MethodInsnNode(Opcodes.INVOKESTATIC, ASM_HOOKS, "removePotionGlint", "()Z", false));
                        newInstructions.add(new JumpInsnNode(Opcodes.IFEQ, label));
                        newInstructions.add(new InsnNode(Opcodes.ICONST_0));
                        newInstructions.add(new InsnNode(Opcodes.IRETURN));
                        newInstructions.add(label);

                        method.instructions.insertBefore(instruction, newInstructions);
                        didThing = true;
                        break;
                    }
                }


                if (didThing) {
                    print("Transformed PotionItem");
                } else {
                    print("Failed to transform PotionItem")
                }

                return method;
            }
        },

        /*
         * RepairContainer: allow an anvil XP cost of zero.
         */
        'RepairContainer': {
            target: {
                'type': 'METHOD',
                'class': 'net.minecraft.inventory.container.RepairContainer$2',
                'methodName': 'func_82869_a', // canTakeStack
                'methodDesc': '(Lnet/minecraft/entity/player/PlayerEntity;)Z'
            },
            transformer: function(method) {
                var didThing = false;
                var arrayLength = method.instructions.size();
                var newInstructions = new InsnList();
                for (var i = 0; i < arrayLength; ++i) {
                    var instruction = method.instructions.get(i);

                    if (instruction.getOpcode() == Opcodes.IFLE) {
                        var label = instruction.label;
                        newInstructions.add(new MethodInsnNode(Opcodes.INVOKESTATIC, ASM_HOOKS, "getMinimumRepairCost", "()I", false));
                        newInstructions.add(new JumpInsnNode(Opcodes.IF_ICMPLE, label));

                        method.instructions.insert(instruction, newInstructions);
                        method.instructions.remove(instruction);
                        didThing = true;
                        break;
                    }
                }

                if (didThing) {
                    print("Transformed RepairContainer");
                } else {
                    print("Failed to transform RepairContainer")
                }

                return method;
            }
        },

        /*
         * ArmorLayer: skip rendering of armor if player is invisible.
         */
        'ArmorLayer': {
            target: {
                'type': 'METHOD',
                'class': 'net.minecraft.client.renderer.entity.layers.ArmorLayer',
                'methodName': 'func_188361_a', // renderArmorLayer
                'methodDesc': '(Lnet/minecraft/entity/LivingEntity;FFFFFFFLnet/minecraft/inventory/EquipmentSlotType;)V'
            },
            transformer: function(method) {
                var didThing = false;
                var arrayLength = method.instructions.size();
                var newInstructions = new InsnList();
                for (var i = 0; i < arrayLength; ++i) {
                    var instruction = method.instructions.get(i);

                    if (instruction.getOpcode() == Opcodes.ASTORE) {
                        var label = new LabelNode();
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 10));
                        newInstructions.add(new MethodInsnNode(Opcodes.INVOKESTATIC, ASM_HOOKS, "isArmorInvisible", "(Lnet/minecraft/entity/Entity;Lnet/minecraft/item/ItemStack;)Z", false));
                        newInstructions.add(new JumpInsnNode(Opcodes.IFEQ, label));
                        newInstructions.add(new InsnNode(Opcodes.RETURN));
                        newInstructions.add(label);

                        method.instructions.insert(instruction, newInstructions);
                        didThing = true;
                        break;
                    }
                }

                if (didThing) {
                    print("Transformed ArmorLayer");
                } else {
                    print("Failed to transform ArmorLayer")
                }

                return method;
            }
        },

        /*
         * BeaconTileEntity: handle other mobs in area.
         */
        'BeaconTileEntity': {
            target: {
                'type': 'METHOD',
                'class': 'net.minecraft.tileentity.BeaconTileEntity',
                'methodName': 'func_146000_x', // addEffectsToPlayers
                'methodDesc': '()V'
            },
            transformer: function(method) {
                var didThing = false;
                var arrayLength = method.instructions.size();
                var instruction = method.instructions.get(0);
                var newInstructions = new InsnList();

                newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                newInstructions.add(new FieldInsnNode(Opcodes.GETFIELD, "net/minecraft/tileentity/BeaconTileEntity", ASM.mapField("field_145850_b"), "Lnet/minecraft/world/World;")); // world
                newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                newInstructions.add(new FieldInsnNode(Opcodes.GETFIELD, "net/minecraft/tileentity/BeaconTileEntity", ASM.mapField("field_146012_l"), "I")); // levels
                newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                newInstructions.add(new FieldInsnNode(Opcodes.GETFIELD, "net/minecraft/tileentity/BeaconTileEntity", ASM.mapField("field_174879_c"), "Lnet/minecraft/util/math/BlockPos;")); // pos
                newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                newInstructions.add(new FieldInsnNode(Opcodes.GETFIELD, "net/minecraft/tileentity/BeaconTileEntity", ASM.mapField("field_146013_m"), "Lnet/minecraft/potion/Effect;")); // primaryEffect
                newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                newInstructions.add(new FieldInsnNode(Opcodes.GETFIELD, "net/minecraft/tileentity/BeaconTileEntity", ASM.mapField("field_146010_n"), "Lnet/minecraft/potion/Effect;"));
                newInstructions.add(new MethodInsnNode(Opcodes.INVOKESTATIC, ASM_HOOKS, "mobsInBeaconRange", "(Lnet/minecraft/world/World;ILnet/minecraft/util/math/BlockPos;Lnet/minecraft/potion/Effect;Lnet/minecraft/potion/Effect;)V", false));

                method.instructions.insertBefore(instruction, newInstructions);
                print("Transformed BeaconTileEntity");

                return method;
            }
        },

        /*
         * ItemStack: check item damage.
         * Hook directly after this.setDamage(l).
         */
        'ItemStack': {
            target: {
                'type': 'METHOD',
                'class': 'net.minecraft.item.ItemStack',
                'methodName': 'func_96631_a', // attemptDamageItem
                'methodDesc': '(ILjava/util/Random;Lnet/minecraft/entity/player/ServerPlayerEntity;)Z'
            },
            transformer: function(method) {
                var didThing = false;
                var arrayLength = method.instructions.size();

                for (var i = 0; i < arrayLength; ++i) {
                    var instruction = method.instructions.get(i);
                    var newInstructions = new InsnList();

                    if (instruction.getOpcode() == Opcodes.INVOKEVIRTUAL
                        && (instruction.name == "func_196085_b" || instruction.name == "setDamage")
                    ) {
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                        newInstructions.add(new VarInsnNode(Opcodes.ILOAD, 4));
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 3));
                        newInstructions.add(new MethodInsnNode(Opcodes.INVOKESTATIC, ASM_HOOKS, "itemDamaged", "(Lnet/minecraft/item/ItemStack;ILnet/minecraft/entity/player/ServerPlayerEntity;)V", false));

                        method.instructions.insert(instruction, newInstructions);
                        didThing = true;
                        break;
                    }
                }

                if (didThing) {
                    print("Transformed ItemStack");
                } else {
                    print("Failed to transform ItemStack");
                }

                return method;
            }
        },

        /*
         * HuskEntity: don't check skylight for spawning.
         */
        'HuskEntity': {
            target: {
                'type': 'METHOD',
                'class': 'net.minecraft.entity.monster.HuskEntity',
                'methodName': 'func_223334_b',
                'methodDesc': '(Lnet/minecraft/entity/EntityType;Lnet/minecraft/world/IWorld;Lnet/minecraft/entity/SpawnReason;Lnet/minecraft/util/math/BlockPos;Ljava/util/Random;)Z'
            },
            transformer: function(method) {
                var didThing = false;
                var arrayLength = method.instructions.size();

                for (var i = 0; i < arrayLength; ++i) {
                    var instruction = method.instructions.get(i);
                    var newInstructions = new InsnList();

                    if (instruction.getOpcode() == Opcodes.INVOKEINTERFACE) {
                        newInstructions.add(new MethodInsnNode(Opcodes.INVOKESTATIC, ASM_HOOKS, "isSkyLightMax", "(Lnet/minecraft/world/IWorld;Lnet/minecraft/util/math/BlockPos;)Z", false));

                        method.instructions.insert(instruction, newInstructions);
                        method.instructions.remove(instruction);
                        didThing = true;
                        break;
                    }
                }

                if (didThing) {
                    print("Transformed HuskEntity");
                } else {
                    print("Failed to transform HuskEntity");
                }

                return method;
            }
        },

        /*
         * Composter: allow alternative output handling
         */
        'ComposterBlock': {
            target: {
                'type': 'METHOD',
                'class': 'net.minecraft.block.ComposterBlock',
                'methodName': 'func_220051_a', // onBlockActivated
                'methodDesc': '(Lnet/minecraft/block/BlockState;Lnet/minecraft/world/World;Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/entity/player/PlayerEntity;Lnet/minecraft/util/Hand;Lnet/minecraft/util/math/BlockRayTraceResult;)Z'
            },
            transformer: function(method) {
                var didThing = false;
                var arrayLength = method.instructions.size();

                for (var i = 0; i < arrayLength; ++i) {
                    var instruction = method.instructions.get(i);
                    var newInstructions = new InsnList();

                    if (instruction.getOpcode() == Opcodes.INVOKEVIRTUAL
                        && (instruction.name == "func_184133_a" || instruction.name == "playSound")
                    ) {
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 2));
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 3));
                        newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 4));
                        newInstructions.add(new MethodInsnNode(Opcodes.INVOKESTATIC, ASM_HOOKS, "composterOutput", "(Lnet/minecraft/world/World;Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/entity/player/PlayerEntity;)V", false));

                        method.instructions.insert(instruction, newInstructions);
                        didThing = true;
                        break;
                    }
                }

                if (didThing) {
                    print("Transformed ComposterBlock");
                } else {
                    print("Failed to transform ComposterBlock");
                }

                return method;
            }
        },


        /*
         * MusicTicker: override music ticker tick
         */
        'MusicTickerTick': {
            target: {
                'type': 'METHOD',
                'class': 'net.minecraft.client.audio.MusicTicker',
                'methodName': 'func_73660_a', // tick
                'methodDesc': '()V'
            },
            transformer: function(method) {
                var didThing = false;
                var instruction = method.instructions.get(0);
                var newInstructions = new InsnList();

                var label = new LabelNode();
                newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                newInstructions.add(new FieldInsnNode(Opcodes.GETFIELD, "net/minecraft/client/audio/MusicTicker", ASM.mapField("field_147678_c"), "Lnet/minecraft/client/audio/ISound;")); // currentMusic
                newInstructions.add(new MethodInsnNode(Opcodes.INVOKESTATIC, ASM_HOOKS, "handleMusicTick", "(Lnet/minecraft/client/audio/ISound;)Z", false));
                newInstructions.add(new JumpInsnNode(Opcodes.IFEQ, label));
                newInstructions.add(new InsnNode(Opcodes.RETURN));
                newInstructions.add(label);

                method.instructions.insertBefore(instruction, newInstructions);
                print("Transformed MusicTicker tick");

                return method;
            }
        },

        /*
         * MusicTicker: override music ticker stop
         */
        'MusicTickerStop': {
            target: {
                'type': 'METHOD',
                'class': 'net.minecraft.client.audio.MusicTicker',
                'methodName': 'func_209200_a', // stop
                'methodDesc': '()V'
            },
            transformer: function(method) {
                var didThing = false;
                var instruction = method.instructions.get(0);
                var newInstructions = new InsnList();

                var label = new LabelNode();
                newInstructions.add(new MethodInsnNode(Opcodes.INVOKESTATIC, ASM_HOOKS, "handleMusicStop", "()Z", false));
                newInstructions.add(new JumpInsnNode(Opcodes.IFEQ, label));
                newInstructions.add(new InsnNode(Opcodes.RETURN));
                newInstructions.add(label);

                method.instructions.insertBefore(instruction, newInstructions);
                print("Transformed MusicTicker stop");

                return method;
            }
        },

        /*
         * MusicTicker: override music ticker isPlaying
         */
        'MusicTickerPlaying': {
            target: {
                'type': 'METHOD',
                'class': 'net.minecraft.client.audio.MusicTicker',
                'methodName': 'func_209100_b', // isPlaying
                'methodDesc': '(Lnet/minecraft/client/audio/MusicTicker$MusicType;)Z'
            },
            transformer: function(method) {
                var didThing = false;
                var instruction = method.instructions.get(0);
                var newInstructions = new InsnList();

                var label = new LabelNode();
                newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                newInstructions.add(new MethodInsnNode(Opcodes.INVOKESTATIC, ASM_HOOKS, "handleMusicPlaying", "(Lnet/minecraft/client/audio/MusicTicker$MusicType;)Z", false));
                newInstructions.add(new JumpInsnNode(Opcodes.IFEQ, label));
                newInstructions.add(new InsnNode(Opcodes.ICONST_1));
                newInstructions.add(new InsnNode(Opcodes.IRETURN));
                newInstructions.add(label);

                method.instructions.insertBefore(instruction, newInstructions);
                print("Transformed MusicTicker isPlaying");

                return method;
            }
        }
    }
}