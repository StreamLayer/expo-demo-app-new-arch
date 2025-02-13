package com.margelo.nitro.nitromodule

@DoNotStrip
class NitroModule : HybridNitroModuleSpec() {
  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }
}
