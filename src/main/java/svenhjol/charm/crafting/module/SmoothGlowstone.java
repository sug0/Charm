package svenhjol.charm.crafting.module;

import svenhjol.charm.base.CharmCategories;
import svenhjol.charm.crafting.block.SmoothGlowstoneBlock;
import svenhjol.meson.MesonModule;
import svenhjol.meson.iface.Module;

@Module(category = CharmCategories.CRAFTING)
public class SmoothGlowstone extends MesonModule
{
    public static SmoothGlowstoneBlock block;
    public static float hardness = 0.3F;

    @Override
    public void init()
    {
        block = new SmoothGlowstoneBlock();
    }
}