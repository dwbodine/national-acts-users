export default function setFocusToControl(ctrlId: string): void {
  var ele = document.getElementById(ctrlId);
  if (ele) {
    ele.scrollIntoView({ behavior: 'smooth' });
    ele.focus();
  }
}
