import { ref } from "vue";

export default function useToast() {
    const toastShow = ref(false);
    const toastText = ref('');
    const toastColor = ref('info');
    
    function showToast(text: string, color: string) {
      toastShow.value = true;
      toastText.value = text;
      toastColor.value = color;
    }

    function getToastShow(): boolean {
        return toastShow.value;
    }

    function getToastText(): string {
        return toastText.value;
    }

    function getToastColor(): string {
        return toastColor.value;
    }

    return {
        showToast,
        getToastShow,
        getToastText,
        getToastColor,
    }
}
  