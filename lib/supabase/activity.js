// Best-effort activity log writer. Never throws — a logging failure should
// never take down the real mutation that triggered it.
export async function logActivity(supabase, { actorId, action, caseId = null, description }) {
  try {
    await supabase.from('activity_log').insert({
      actor_id: actorId,
      action,
      case_id: caseId,
      description,
    });
  } catch {
    // Swallow — logging is a nice-to-have, not a correctness requirement.
  }
}
