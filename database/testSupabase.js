const supabase = require('./supabaseClient')

async function testConnection() {
  const { data, error } = await supabase.from('your_table_name').select('*').limit(1)

  if (error) {
    console.log('❌ Supabase ulanmadi:', error.message)
  } else {
    console.log('✅ Supabase ulandi! Malumot:', data)
  }
}

testConnection()
