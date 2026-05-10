import { UserModel } from "@/models/User.model";
import { ActivityLogModel } from "@/models/Operational.model";

export class UserRepository {
  findById(id: string) {
    return UserModel.findById(id);
  }

  updateById(id: string, payload: Record<string, unknown>) {
    return UserModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  }

  listActivity(userId: string) {
    return ActivityLogModel.find({ actorId: userId }).sort({ createdAt: -1 }).limit(50);
  }
}
