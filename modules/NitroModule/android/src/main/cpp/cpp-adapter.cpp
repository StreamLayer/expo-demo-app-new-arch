#include <jni.h>
#include "nitromoduleOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::nitromodule::initialize(vm);
}
