class SkillBasedRecommender:
    """Recommends recipes based on user's cooking skill level"""
    
    @staticmethod
    def get_user_skill_level(user):
        """Determine user's skill level based on recipe history"""
        completed_recipes = UserInteraction.objects.filter(
            user=user,
            interaction_type='complete'
        ).select_related('recipe')
        
        if not completed_recipes:
            return 'beginner'
            
        # Analyze completed recipe difficulties
        difficulties = [
            DifficultyEstimator.estimate_difficulty(recipe)
            for recipe in completed_recipes
        ]
        
        difficulty_counts = {
            'easy': difficulties.count('easy'),
            'medium': difficulties.count('medium'),
            'hard': difficulties.count('hard')
        }
        
        # Determine skill level
        if difficulty_counts['hard'] >= 5:
            return 'advanced'
        elif difficulty_counts['medium'] >= 5:
            return 'intermediate'
        else:
            return 'beginner'
    
    @staticmethod
    def get_recommendations(user, limit=5):
        """Get recipes matching user's skill level"""
        skill_level = SkillBasedRecommender.get_user_skill_level(user)
        
        # Get recipes and filter by difficulty
        recipes = Recipe.objects.all()
        filtered_recipes = [
            recipe for recipe in recipes
            if DifficultyEstimator.estimate_difficulty(recipe) == 
            SkillBasedRecommender.get_matching_difficulty(skill_level)
        ]
        
        return filtered_recipes[:limit]
    
    @staticmethod
    def get_matching_difficulty(skill_level):
        """Map skill level to appropriate recipe difficulty"""
        return {
            'beginner': 'easy',
            'intermediate': 'medium',
            'advanced': 'hard'
        }.get(skill_level, 'easy')