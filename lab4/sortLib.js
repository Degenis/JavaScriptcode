/**
 * sortLib.js
 * Бібліотека сортування числових масивів у JS (псевдопростір імен SortLib).
 * Всі методи:
 *   - приймають (arr, ascending = true)
 *   - повертають відсортований масив-копію
 *   - виводять кількість порівнянь та обмінів/переміщень
 *   - коректно обробляють undefined-елементи розріджених масивів
 */

var SortLib = (function () {

  // ── Внутрішня утиліта ──────────────────────────────────────────────────

  /**
   * Підготовка масиву: відокремлює undefined/відсутні елементи,
   * повертає { defined: [...], undefinedCount: N }.
   */
  function _prepare(arr) {
    var defined = [];
    var undefinedCount = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === undefined) {
        undefinedCount++;
      } else {
        defined.push(arr[i]);
      }
    }
    return { defined: defined, undefinedCount: undefinedCount };
  }

  /**
   * Фінальне повідомлення + відновлення undefined в кінці масиву.
   */
  function _finish(name, sorted, undefinedCount, comparisons, swaps) {
    var result = sorted.slice();
    for (var i = 0; i < undefinedCount; i++) result.push(undefined);

    var msg = "[" + name + "] порівнянь: " + comparisons +
              ", обмінів/переміщень: " + swaps;
    if (undefinedCount > 0) {
      msg += " | ⚠ знайдено " + undefinedCount +
             " undefined-елемент(и) — їх переміщено в кінець масиву";
    }
    console.log(msg);
    return result;
  }

  /** Функція порівняння з урахуванням напряму. */
  function _cmp(a, b, asc) {
    return asc ? a - b : b - a;
  }

  // ── 1. Сортування обміном (Bubble Sort) ────────────────────────────────
  function bubbleSort(arr, ascending) {
    if (ascending === undefined) ascending = true;
    var p = _prepare(arr);
    var a = p.defined;
    var n = a.length;
    var comparisons = 0, swaps = 0;

    for (var i = 0; i < n - 1; i++) {
      var swapped = false;
      for (var j = 0; j < n - 1 - i; j++) {
        comparisons++;
        if (_cmp(a[j], a[j + 1], ascending) > 0) {
          var tmp = a[j]; a[j] = a[j + 1]; a[j + 1] = tmp;
          swaps++;
          swapped = true;
        }
      }
      if (!swapped) break; // оптимізація: масив вже відсортований
    }

    return _finish("Bubble Sort", a, p.undefinedCount, comparisons, swaps);
  }

  // ── 2. Сортування мінімальних елементів (Selection Sort) ───────────────
  function selectionSort(arr, ascending) {
    if (ascending === undefined) ascending = true;
    var p = _prepare(arr);
    var a = p.defined;
    var n = a.length;
    var comparisons = 0, swaps = 0;

    for (var i = 0; i < n - 1; i++) {
      var extremeIdx = i;
      for (var j = i + 1; j < n; j++) {
        comparisons++;
        if (_cmp(a[j], a[extremeIdx], ascending) < 0) {
          extremeIdx = j;
        }
      }
      if (extremeIdx !== i) {
        var tmp = a[i]; a[i] = a[extremeIdx]; a[extremeIdx] = tmp;
        swaps++;
      }
    }

    return _finish("Selection Sort", a, p.undefinedCount, comparisons, swaps);
  }

  // ── 3. Сортування вставками (Insertion Sort) ───────────────────────────
  function insertionSort(arr, ascending) {
    if (ascending === undefined) ascending = true;
    var p = _prepare(arr);
    var a = p.defined;
    var n = a.length;
    var comparisons = 0, swaps = 0;

    for (var i = 1; i < n; i++) {
      var key = a[i];
      var j = i - 1;
      while (j >= 0) {
        comparisons++;
        if (_cmp(a[j], key, ascending) > 0) {
          a[j + 1] = a[j];
          swaps++;
          j--;
        } else {
          break;
        }
      }
      a[j + 1] = key;
    }

    return _finish("Insertion Sort", a, p.undefinedCount, comparisons, swaps);
  }

  // ── 4. Сортування Шелла (Shell Sort) ───────────────────────────────────
  function shellSort(arr, ascending) {
    if (ascending === undefined) ascending = true;
    var p = _prepare(arr);
    var a = p.defined;
    var n = a.length;
    var comparisons = 0, swaps = 0;

    // Послідовність кроків Кнута: 1, 4, 13, 40, 121 …
    var gap = 1;
    while (gap < Math.floor(n / 3)) gap = gap * 3 + 1;

    while (gap >= 1) {
      for (var i = gap; i < n; i++) {
        var key = a[i];
        var j = i - gap;
        while (j >= 0) {
          comparisons++;
          if (_cmp(a[j], key, ascending) > 0) {
            a[j + gap] = a[j];
            swaps++;
            j -= gap;
          } else {
            break;
          }
        }
        a[j + gap] = key;
      }
      gap = Math.floor((gap - 1) / 3);
    }

    return _finish("Shell Sort", a, p.undefinedCount, comparisons, swaps);
  }

  // ── 5. Швидке сортування Хоара (Quick Sort) ────────────────────────────
  function quickSort(arr, ascending) {
    if (ascending === undefined) ascending = true;
    var p = _prepare(arr);
    var a = p.defined.slice(); // копія, щоб не мутувати оригінал
    var comparisons = 0, swaps = 0;

    function _partition(lo, hi) {
      // Медіана трьох — зменшує ймовірність гіршого випадку
      var mid = Math.floor((lo + hi) / 2);
      if (_cmp(a[lo], a[mid], ascending) > 0) { var t = a[lo]; a[lo] = a[mid]; a[mid] = t; swaps++; }
      if (_cmp(a[lo], a[hi], ascending) > 0)  { var t = a[lo]; a[lo] = a[hi];  a[hi]  = t; swaps++; }
      if (_cmp(a[mid], a[hi], ascending) > 0) { var t = a[mid]; a[mid] = a[hi]; a[hi] = t; swaps++; }

      var pivot = a[mid];
      // Ховаємо pivot у передостанню позицію
      var t2 = a[mid]; a[mid] = a[hi - 1]; a[hi - 1] = t2; swaps++;

      var i = lo, j = hi - 1;
      while (true) {
        comparisons++; while (_cmp(a[++i], pivot, ascending) < 0) comparisons++;
        comparisons++; while (_cmp(a[--j], pivot, ascending) > 0) comparisons++;
        if (i >= j) break;
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp; swaps++;
      }
      // Повертаємо pivot
      var tmp2 = a[i]; a[i] = a[hi - 1]; a[hi - 1] = tmp2; swaps++;
      return i;
    }

    function _qsort(lo, hi) {
      if (hi - lo < 10) {
        // Для малих підмасивів — вставки (гібридна оптимізація)
        for (var i = lo + 1; i <= hi; i++) {
          var key = a[i], j = i - 1;
          while (j >= lo) {
            comparisons++;
            if (_cmp(a[j], key, ascending) > 0) { a[j + 1] = a[j]; swaps++; j--; } else break;
          }
          a[j + 1] = key;
        }
        return;
      }
      var pivotIdx = _partition(lo, hi);
      _qsort(lo, pivotIdx - 1);
      _qsort(pivotIdx + 1, hi);
    }

    if (a.length > 1) _qsort(0, a.length - 1);

    return _finish("Quick Sort (Hoare)", a, p.undefinedCount, comparisons, swaps);
  }

  // ── Публічний інтерфейс (псевдопростір імен) ──────────────────────────
  return {
    bubbleSort:    bubbleSort,
    selectionSort: selectionSort,
    insertionSort: insertionSort,
    shellSort:     shellSort,
    quickSort:     quickSort,
  };

})();
