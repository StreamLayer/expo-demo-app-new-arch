package com.streamlayer

import android.util.Log
import android.content.Context
import android.util.AttributeSet
import android.view.View

class RCTStreamLayerModuleView : View {
  constructor(context: Context?) : super(context)
  constructor(context: Context?, attrs: AttributeSet?) : super(context, attrs)
  constructor(context: Context?, attrs: AttributeSet?, defStyleAttr: Int) : super(
    context,
    attrs,
    defStyleAttr
  )

  fun setSourceURL(value: String?) {
    Log.d("RCTStreamLayerFabricView", "Source URL set to: $value")
    // Здесь можно добавить логику загрузки данных из переданного URL
  }

}
