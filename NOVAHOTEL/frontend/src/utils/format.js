export function currency(v){
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)
}

export function formatDate(iso){
  return new Date(iso).toLocaleDateString('vi-VN')
}
