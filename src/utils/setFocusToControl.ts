export default function setFocusToControl(ctrlId: string): void {
  if (ctrlId) {
    var ele = document.getElementById(ctrlId);
    if (ele) {
      ele.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      ele.focus();
    }
  }
}
