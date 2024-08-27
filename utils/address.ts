export function cleanAddress(addr) {
    if (addr.startsWith("ethereum:")) {
      return addr.replace(/^ethereum:/, '').split('@')[0];
    } else if (addr.includes('@')) {
      return addr.split('@')[0];
    }
    // If the address is already clean, return it as is
    return addr;
}