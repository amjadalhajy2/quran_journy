const SUPABASE_URL = 'https://fwganswnfiwomsdxutjt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zroHxNDcmv5QApFYfWLoiA_XcVvHqKw';

// الحل: نقوم بإنشاء الاتصال وتخزينه في نفس المتغير العام الذي حجزته المكتبة
// لتفادي خطأ "Identifier has already been declared"
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// دالة للتحقق من الصلاحيات وتوجيه المستخدمين
async function checkUserAccess(requiredRole = null) {
    const { data: { user } } = await window.supabase.auth.getUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }

    // جلب دور المستخدم من قاعدة البيانات للتحقق من مصفوفة الصلاحيات
    const { data: userData, error } = await window.supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (error || !userData) {
        console.error('خطأ في جلب الصلاحيات');
        return null;
    }

    if (requiredRole && userData.role !== requiredRole) {
        alert('ليس لديك صلاحية للوصول إلى هذه الصفحة');
        // توجيه تلقائي بناءً على الصلاحية الفعلية
        if (userData.role === 'admin') window.location.href = 'admin_dashboard.html';
        else if (userData.role === 'teacher') window.location.href = 'teacher_dashboard.html';
        else window.location.href = 'student_dashboard.html';
    }
    
    return { user, role: userData.role };
}
