@@ .. @@
 }, {
   timestamps: true,
 });

+// Indexes for performance
+InternSchema.index({ internId: 1 }, { unique: true });
+InternSchema.index({ email: 1 });
+InternSchema.index({ department: 1 });
+InternSchema.index({ status: 1 });
+InternSchema.index({ referredByEmpId: 1 });

 export const Intern = mongoose.model<IIntern>('Intern', InternSchema);